import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

exports.generateImageDocument = functions.storage.object().onFinalize(async (object) => {
  const { name, metadata, contentType, size } = object;
  functions.logger.log(`1 file uploaded to storage: ${name}`);

  if (name && metadata) {
    // Image name has the form `uid/libraryID/imageName`, ex: laLvpMgONMPO5nMyqXuot38U8jp2/rPwfu42CHzverW4mGGWp/CoolImage
    const [uid, libraryID, imageName] = name.split('/');

    const firebaseStorageBaseUrl = `https://firebasestorage.googleapis.com/v0/b/${
      storage.bucket().name
    }/o`;
    const downloadURL = `${firebaseStorageBaseUrl}/${encodeURIComponent(name)}?alt=media&token=${
      metadata.firebaseStorageDownloadTokens
    }`;

    functions.logger.log('Download Url: ', downloadURL);

    // create a image document the uploaded file
    const libRef = db.collection(`firebase_users/${uid}/libraries`).doc(libraryID);
    const imageRef = libRef.collection('images').doc();
    await imageRef.set({
      note: '',
      library: libRef,
      upload_date: admin.firestore.FieldValue.serverTimestamp(),
      name: imageName,
      downloadURL,
      contentType: contentType,
      size: size,
      fullPath: name,
    });
    await libRef.update({
      image_count: admin.firestore.FieldValue.increment(1),
    });
  }
});

exports.deleteImageStorage = functions.firestore
  .document('firebase_users/{uid}/libraries/{libraryID}/images/{imageID}')
  .onDelete(async (snap) => {
    const { fullPath, library: libRef } = snap.data();

    try {
      const lib = await libRef.get();
      await storage.bucket().file(fullPath).delete({ ignoreNotFound: true });
      if (lib.exists) {
        await libRef.update({
          image_count: admin.firestore.FieldValue.increment(-1),
        });
      }
      functions.logger.log('Deleted 1 file from storage: ', fullPath);
    } catch (error) {
      functions.logger.error('Failed to delete 1 file: ', fullPath);
      functions.logger.error(error);
    }
  });

exports.deleteLibrary = functions.firestore
  .document('firebase_users/{uid}/libraries/{libraryID}')
  .onDelete(async (snap, context) => {
    const batchSize = 50;
    const { id: libraryID } = snap;

    functions.logger.log(`Library ${libraryID} deleted`);

    const collectionRef = db.collection(
      `firebase_users/${context.auth?.uid}/libraries/${libraryID}/images`
    );
    const query = collectionRef.orderBy('upload_date').limit(batchSize);

    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, resolve).catch(reject);
    });
  });

async function deleteQueryBatch(
  db: FirebaseFirestore.Firestore,
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  resolve: (value: unknown | void) => void
) {
  const snapshot = await query.get();

  functions.logger.log(
    'Deleting the next batch of image documents under images collection from the recently deleted library'
  );

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve(undefined);
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
