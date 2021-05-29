import { Library, UploadedFile } from '../interfaces';
import { auth, db, storage, firebase, firestore } from './firebase';

export async function createLibrary(name: string) {
  if (auth.currentUser) {
    const libRef = await db.libraries.add({
      name,
      image_count: 0,
      owner: auth.currentUser.uid,
    });
    const lib = await libRef.get();
    return { ...lib.data(), id: libRef.id } as Library;
  }
}

export async function uploadImages(acceptedFiles: File[], libraryID: string): Promise<void> {
  if (auth.currentUser) {
    const libRef = db.libraries.doc(libraryID);
    let successfulUploads = 0;
    const uploadedFiles: UploadedFile[] = [];
    const promises: firebase.storage.UploadTask[] = [];

    // upload files first
    acceptedFiles.forEach((file) => {
      const filePath = `${auth.currentUser?.uid}/${libraryID}/${file.name}`;

      const upload = storage.ref(filePath).put(file);
      promises.push(upload);
      upload.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (error) => console.error(error),
        async () => {
          const imageURL = await upload.snapshot.ref.getDownloadURL();
          uploadedFiles.push(Object.assign(file, { downloadURL: imageURL }));
          successfulUploads += 1;
        }
      );
    });
    await Promise.all(promises);

    // create new image documents for each uploaded file
    const batch = firestore.batch();
    uploadedFiles.forEach((image) => {
      const imageRef = db.images.doc(`${libraryID}_${image.name}`);
      batch.set(imageRef, {
        name: image.name,
        note: '',
        library: libRef,
        src: image.downloadURL,
        upload_date: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();

    // update the library's image_count
    await libRef.update({
      image_count: firebase.firestore.FieldValue.increment(successfulUploads),
    });
  }
}
