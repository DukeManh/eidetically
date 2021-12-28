import {
  addDoc,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { collection, serverTimestamp } from 'firebase/firestore';
import { ref, updateMetadata, uploadBytesResumable } from 'firebase/storage';

import task from '../components/UploadProgress/task';
import { auth, db, storage } from './firebase';
import { Image, ImageFile, Library, MutableImageProperties } from '../interfaces';
import { createImagePreview } from '../utilities';

const errors = {
  libExists: new Error('Library exists, choose a different name'),
  unauthenticated: new Error('Please sign in'),
  invalidName: new Error('Choose a library name'),
};

export async function createLibrary(libName: string) {
  if (auth.currentUser) {
    const name = libName.trim();

    if (!name) {
      throw errors.invalidName;
    }
    const existingLib = await getDocs(query(db.libraries(), where('name', '==', name)));

    if (existingLib.empty) {
      const lib = await addDoc(db.libraries(), {
        name,
        image_count: 0,
        owner: auth.currentUser.uid,
      } as Library);

      return lib.id;
    }
    throw errors.libExists;
  } else {
    throw errors.unauthenticated;
  }
}

export async function deleteLibrary(libID: string) {
  if (auth.currentUser) {
    try {
      const libRef = doc(db.libraries(), libID);
      await deleteDoc(libRef);
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
    const libRef = doc(db.libraries(), libID);
    const lib = await getDoc(libRef);
    if (lib.exists() && lib.data()?.name !== name) {
      const sameNameLib = await getDocs(query(db.libraries(), where('name', '==', name)));

      if (sameNameLib.empty) {
        updateDoc(libRef, {
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

async function uploadImage(image: ImageFile, libraryID: string, storagePath?: string) {
  const uuid = uuidv4();
  const imagePath = storagePath || `${auth.currentUser?.uid}/${libraryID}/${uuid}`;
  const imageName = image.name || uuid;

  const preview = await createImagePreview(image);

  const files = [
    {
      file: image,
      path: imagePath,
      isPreview: false,
      name: imageName,
    },
    {
      file: preview,
      path: `${imagePath}-preview`,
      isPreview: true,
      name: imageName,
    },
  ];

  return files.map(({ file, path, isPreview, name }) => {
    const fileRef = ref(storage, path);
    return uploadBytesResumable(fileRef, file, {
      customMetadata: {
        isPreview: isPreview ? 'true' : 'false',
        name,
        source: 'Self Uploaded',
      },
    });
  });
}

export async function uploadImages(acceptedFiles: ImageFile[], libraryID: string) {
  if (auth.currentUser) {
    task.start(acceptedFiles.length);

    const promises = acceptedFiles.map((file) => {
      return new Promise<void>((resolve) => {
        uploadImage(file, libraryID).then((uploads) => {
          const t = task.new(file, () => uploads.every((upload) => upload.cancel()));
          Promise.all(uploads)
            .then(async () => {
              task.complete(t.id);
              resolve();
            })
            .catch((error) => {
              task.fail(t.id);
              console.error(error.message);
              resolve();
            });
        });
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
      const imageRef = doc(collection(image.library, 'images'), image.id);
      deleteDoc(imageRef).catch((error) => {
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
    const imageRef = doc(collection(image.library, 'images'), image.id);
    await updateDoc(imageRef, {
      ...properties,
      last_updated: serverTimestamp(),
    });

    const storageRef = ref(storage, image.fullPath);
    await updateMetadata(storageRef, {
      customMetadata: {
        note: properties.note,
        source: properties.source,
        name: properties.name,
      },
    });
  } else {
    throw errors.unauthenticated;
  }
}

export function updateImageSource(image: Image, file: File): Promise<void> {
  if (auth.currentUser) {
    return new Promise((resolve, reject) => {
      uploadImage(file, image.library.id, image.fullPath)
        .then((uploads) => {
          Promise.all(uploads)
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  } else {
    throw errors.unauthenticated;
  }
}
