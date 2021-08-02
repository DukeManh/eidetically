import { Image } from '../interfaces';
import { auth, db, storage } from './firebase';

import task from '../components/UploadProgress/task';

const errors = {
  libExists: new Error('Library exists, choose a different name'),
  unauthenticated: new Error('User not authenticated'),
};

export async function createLibrary(name: string) {
  if (auth.currentUser) {
    const existingLib = await db.libraries
      .where('owner', '==', auth.currentUser.uid)
      .where('name', '==', name)
      .get();

    if (existingLib.empty) {
      const lib = await db.libraries.add({
        name,
        image_count: 0,
        owner: auth.currentUser.uid,
      });

      return lib.id;
    } else {
      throw errors.libExists;
    }
  } else {
    throw errors.unauthenticated;
  }
}

export async function deleteLibrary(libID: string) {
  if (auth.currentUser) {
    try {
      const libRef = db.libraries.doc(libID);
      await libRef.delete();
    } catch (error) {
      console.error(error);
    }
  } else {
    throw errors.unauthenticated;
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
  } else {
    throw errors.unauthenticated;
  }
}

export async function uploadImages(acceptedFiles: File[], libraryID: string) {
  if (auth.currentUser) {
    const promises: Promise<string>[] = [];

    task.start(acceptedFiles.length);

    acceptedFiles.forEach((file) => {
      const filePath = `${auth.currentUser?.uid}/${libraryID}/${file.name}`;
      promises.push(
        new Promise((resolve) => {
          const upload = storage.ref(filePath).put(file);
          const t = task.new(file, upload.cancel);
          upload.then(
            async () => {
              task.complete(t.id);
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
  } else {
    throw errors.unauthenticated;
  }
}

export async function deleteImages(images: Image[]): Promise<void> {
  if (auth.currentUser) {
    images.forEach((image) => {
      const imageRef = image.library.collection('images').doc(image.id);
      imageRef.delete().catch((error) => {
        console.error(error);
      });
    });
  } else {
    throw errors.unauthenticated;
  }
}
