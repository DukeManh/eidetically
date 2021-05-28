import { UploadedFile } from '../interfaces';
import { auth, db, storage, firebase, firestore } from './firebase';

export async function createLibrary(name: string) {
  if (auth.currentUser) {
    await db.libraries.add({
      name,
      image_count: 0,
      owner: auth.currentUser.uid,
    });
  }
}

export async function uploadImages(acceptedFiles: File[], libraryID: string): Promise<void> {
  if (auth.currentUser) {
    let successfulUploads = 0;
    const uploadedFiles: UploadedFile[] = [];
    const promises: firebase.storage.UploadTask[] = [];

    // upload files
    acceptedFiles.forEach((file) => {
      const filePath = `${auth.currentUser?.uid}/${libraryID}/${file.name}`;

      const upload = storage.ref(filePath).put(file);
      promises.push(upload);
      upload.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {
          console.log('Uploading ' + filePath);
        },
        (error) => console.error(error),
        async () => {
          const imageURL = await upload.snapshot.ref.getDownloadURL();
          uploadedFiles.push({ ...file, downloadURL: imageURL });
          successfulUploads += 1;
        }
      );
    });

    await Promise.all(promises);

    // create a new image documents
    const batch = firestore.batch();
    uploadedFiles.forEach((image) => {
      const imageRef = db.images.doc(`${auth.currentUser?.displayName}_${libraryID}_${image.name}`);

      batch.set(imageRef, {
        name: image.name,
        note: '',
        library: libRef,
        src: image.downloadURL,
        upload_date: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();

    // update the library's image count
    const libRef = db.libraries.doc(libraryID);
    await libRef.update({
      image_count: firebase.firestore.FieldValue.increment(successfulUploads),
    });
  }
}
