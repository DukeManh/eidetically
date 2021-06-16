import { MetaData, Image } from '../interfaces';
import { auth, db, storage, firebase } from './firebase';

import { noop } from '../utilities';

const errors = {
  libExists: new Error(
    'A library with the same name already exists, please choose a different name'
  ),
};

export async function createLibrary(name: string) {
  if (auth.currentUser) {
    const existingLib = await db.libraries
      .where('owner', '==', auth.currentUser.uid)
      .where('name', '==', name)
      .get();

    if (existingLib.empty) {
      await db.libraries.add({
        name,
        image_count: 0,
        owner: auth.currentUser.uid,
      });
    } else {
      throw errors.libExists;
    }
  }
}

export async function deleteLibrary(libID: string) {
  if (auth.currentUser) {
    try {
      const libRef = db.libraries.doc(libID);
      await libRef.delete();

      const storageRef = storage.ref(`${auth.currentUser.uid}/${libID}`);
      const filesRef = await storageRef.listAll();
      filesRef.items.forEach((file) => {
        file.delete();
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export async function renameLibrary(libID: string, name: string) {
  if (auth.currentUser) {
    const libRef = db.libraries.doc(libID);
    const lib = await libRef.get();
    if (lib.exists && lib.data()?.name !== name) {
      const sameNameLib = await db.libraries
        .where('owner', '==', auth.currentUser.uid)
        .where('name', '==', name)
        .get();

      if (sameNameLib.empty) {
        libRef.update({
          name,
        });
      } else {
        throw errors.libExists;
      }
    }
  }
}

export async function uploadImages(
  acceptedFiles: File[],
  libraryID: string,
  onNext?: (fileName: string) => void,
  onComplete?: (success: number) => void
): Promise<void> {
  if (auth.currentUser) {
    const libRef = db.libraries.doc(libraryID);
    let successfulUploads = 0;
    const promises: Promise<string>[] = [];

    // upload files first
    acceptedFiles.forEach((file) => {
      const filePath = `${auth.currentUser?.uid}/${libraryID}/${file.name}`;

      promises.push(
        new Promise((resolve, reject) => {
          storage
            .ref(filePath)
            .put(file)
            .then(
              async (snap) => {
                const { contentType, size, fullPath } = snap.metadata as MetaData;
                const downloadURL = await snap.ref.getDownloadURL();
                successfulUploads += 1;

                // create a new image document for each uploaded file
                const imageRef = libRef.collection('images').doc();
                imageRef.set({
                  note: '',
                  library: libRef,
                  upload_date: firebase.firestore.FieldValue.serverTimestamp(),
                  name: file.name,
                  downloadURL,
                  contentType,
                  size,
                  fullPath,
                });

                (onNext || noop)(file.name);

                resolve(downloadURL);
              },
              (error) => {
                reject(error.message);
              }
            );
        })
      );
    });

    await Promise.all(promises).catch((error) => {
      console.error(error);
    });

    (onComplete || noop)(successfulUploads);

    // update the library's image_count
    await libRef.update({
      image_count: firebase.firestore.FieldValue.increment(successfulUploads),
    });
  }
}

export async function deleteImages(
  images: Image[],
  onNext?: (fileName: string) => void,
  onComplete?: (success: number) => void
): Promise<void> {
  if (auth.currentUser && images.length) {
    let successfulDeletes = 0;
    const promises: Promise<Image>[] = [];
    const libRef = images[0].library;

    images.forEach((image) => {
      promises.push(
        new Promise((resolve, reject) => {
          storage
            .ref(image.fullPath)
            .delete()
            .catch((error) => {
              console.error();
              reject(error);
            })
            .finally(() => {
              const imageRef = libRef.collection('images').doc(image.id);
              imageRef
                .delete()
                .then(() => {
                  successfulDeletes += 1;
                  if (onNext) {
                    onNext(image.name);
                  }
                  resolve(image);
                })
                .catch((error) => {
                  console.error(error);
                  reject(error);
                });
            });
        })
      );
    });

    await Promise.all(promises).catch((error) => {
      console.error(error);
    });

    (onComplete || noop)(successfulDeletes);

    // update the library's image_count
    await libRef.update({
      image_count: firebase.firestore.FieldValue.increment(-successfulDeletes),
    });
  }
}
