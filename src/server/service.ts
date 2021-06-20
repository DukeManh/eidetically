import { MetaData, Image } from '../interfaces';
import { auth, db, storage, firebase } from './firebase';

import task from '../components/UploadProgress/task';

const errors = {
  libExists: new Error('Library exists, choose a different name'),
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

export async function uploadImages(acceptedFiles: File[], libraryID: string) {
  if (auth.currentUser) {
    const libRef = db.libraries.doc(libraryID);
    const promises: Promise<string>[] = [];

    task.start(acceptedFiles.length);
    // upload files first
    acceptedFiles.forEach((file) => {
      const filePath = `${auth.currentUser?.uid}/${libraryID}/${file.name}`;
      promises.push(
        new Promise((resolve) => {
          const upload = storage.ref(filePath).put(file);
          const t = task.new(file, upload.cancel);
          upload.then(
            async (snap) => {
              const { contentType, size, fullPath } = snap.metadata as MetaData;
              const downloadURL = await snap.ref.getDownloadURL();

              // create a new image document for each uploaded file
              const imageRef = libRef.collection('images').doc();
              await imageRef.set({
                note: '',
                library: libRef,
                upload_date: firebase.firestore.FieldValue.serverTimestamp(),
                name: file.name,
                downloadURL,
                contentType,
                size,
                fullPath,
              });

              task.complete(t.id);
              await libRef.update({
                image_count: firebase.firestore.FieldValue.increment(1),
              });

              resolve(downloadURL);
            },
            (error) => {
              task.fail(t.id);
              console.error(error.message);
              resolve('');
            }
          );
        })
      );
    });

    await Promise.all(promises).catch((error) => {
      console.error(error);
    });

    task.done();
  }
}

export async function deleteImages(images: Image[]): Promise<void> {
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
              error();
              reject(error);
            })
            .finally(() => {
              const imageRef = libRef.collection('images').doc(image.id);
              imageRef
                .delete()
                .then(() => {
                  successfulDeletes += 1;
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

    // update the library's image_count
    await libRef.update({
      image_count: firebase.firestore.FieldValue.increment(-successfulDeletes),
    });
  }
}
