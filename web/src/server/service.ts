import { v4 as uuidv4 } from 'uuid';

import { auth, db, storage } from './firebase';
import { Image, MutableImageProperties } from '../interfaces';

import task from '../components/UploadProgress/task';

const errors = {
  libExists: new Error('Library exists, choose a different name'),
  unauthenticated: new Error('User not authenticated'),
  invalidName: new Error('Choose a library name'),
};

export async function createLibrary(libName: string) {
  if (auth.currentUser) {
    const name = libName.trim();

    if (!name) {
      throw errors.invalidName;
    }
    const existingLib = await db.libraries().where('name', '==', name).get();

    if (existingLib.empty) {
      const lib = await db.libraries().add({
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
      const libRef = db.libraries().doc(libID);
      await libRef.delete();
    } catch (error) {
      console.error(error);
    }
  } else {
    throw errors.unauthenticated;
  }
}

export async function renameLibrary(libID: string, libName: string) {
  if (auth.currentUser) {
    const name = libName.trim();

    if (!name) {
      throw errors.invalidName;
    }
    const libRef = db.libraries().doc(libID);
    const lib = await libRef.get();
    if (lib.exists && lib.data()?.name !== name) {
      const sameNameLib = await db.libraries().where('name', '==', name).get();

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
    task.start(acceptedFiles.length);

    const promises = acceptedFiles.map((file) => {
      const uuid = uuidv4();
      const filePath = `${auth.currentUser?.uid}/${libraryID}/${uuid}`;
      return new Promise<void>((resolve) => {
        const upload = storage.ref(filePath).put(file, {
          customMetadata: {
            name: file.name,
            source: 'Self uploaded',
          },
        });
        const t = task.new(file, upload.cancel);
        upload.then(
          async () => {
            task.complete(t.id);
            resolve();
          },
          (error) => {
            task.fail(t.id);
            console.error(error.message);
            resolve();
          }
        );
      });
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

export async function updateImageProperties(
  image: Image,
  properties: MutableImageProperties
): Promise<void> {
  if (auth.currentUser) {
    const imageRef = image.library.collection('images').doc(image.id);
    await imageRef.update(properties);
  } else {
    throw errors.unauthenticated;
  }
}

export async function updateImageSource(image: Image, file: File): Promise<void> {
  if (auth.currentUser) {
    try {
      const filePath = image.fullPath;

      await storage.ref(filePath).put(file, {
        customMetadata: {
          name: image.name,
        },
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    throw errors.unauthenticated;
  }
}
