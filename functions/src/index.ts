import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

/**
 *  if preivew => upload previewURL
 *  if image  => upload download Uurl, full image doc
 */

exports.generateImageDocument = functions.storage.object().onFinalize(async (object) => {
  const { name: fullName, metadata, contentType, size } = object;
  if (fullName && metadata) {
    // Full name has the form `uid/libraryID/imageId`, ex: laLvpMgONMPO5nMyqXuot38U8jp2/rPwfu42CHzverW4mGGWp/55af1e37-0734-46d8-b070-a1e42e4fc392
    const [uid, libraryID, imageId] = fullName.split('/');

    const imageName = metadata.name ?? uuidv4();
    const source = metadata.source ?? '';
    const note = metadata.note ?? '';
    const isPreview = metadata.isPreview === 'true' ? true : false;

    let baseName = imageId;
    if (isPreview) {
      // preview image has '-preview' post-fix
      const splitName = baseName.split('-');
      splitName.pop();
      baseName = splitName.join('-');
      functions.logger.log(`1 preview image uploaded: ${fullName}`);
    } else {
      functions.logger.log(`1 file uploaded: ${fullName}`);
    }

    // Bucket baseURL
    const firebaseStorageBaseUrl = `https://firebasestorage.googleapis.com/v0/b/${
      storage.bucket().name
    }/o`;

    // Manually get the private download url (url + downloadToken)
    const getPrivateUrl = (filePath: string) =>
      `${firebaseStorageBaseUrl}/${encodeURIComponent(filePath)}?alt=media&token=${
        metadata.firebaseStorageDownloadTokens
      }`;

    const downloadURL = getPrivateUrl(fullName);

    // firestore document for the uploaded file
    const libRef = db.collection(`firebase_users/${uid}/libraries`).doc(libraryID);
    const imageRef = libRef.collection('images').doc(baseName);
    const image = await imageRef.get();

    // An existing image is being replaced
    if (image.exists && image.data()?.previewURL && image.data()?.downloadURL) {
      functions.logger.log(`1 file is replaced: ${fullName}`);
      await imageRef.update({ downloadURL, size });
      return;
    }

    functions.logger.log(`updating image document`);
    // New upload
    imageRef.set(
      {
        note,
        library: libRef,
        upload_date: admin.firestore.FieldValue.serverTimestamp(),
        name: imageName,
        source,
        ...(!isPreview && { contentType }),
        ...(!isPreview && { size }),
        fullPath: fullName,
        ...(isPreview ? { previewURL: downloadURL } : { downloadURL }),
      },
      { merge: true }
    );

    if (!isPreview) {
      functions.logger.log(`updating image count`);
      await libRef.update({
        image_count: admin.firestore.FieldValue.increment(1),
      });
    }
  }
});

exports.deleteImageStorage = functions.firestore
  .document('firebase_users/{uid}/libraries/{libraryID}/images/{imageID}')
  .onDelete(async (snap) => {
    const { fullPath, library: libRef } = snap.data();

    try {
      const lib = await libRef.get();
      storage.bucket().file(fullPath).delete({ ignoreNotFound: true });
      storage.bucket().file(`${fullPath}-preview`).delete({ ignoreNotFound: true });
      if (lib.exists) {
        libRef.update({
          image_count: admin.firestore.FieldValue.increment(-1),
        });
      }
      functions.logger.log('Deleted 1 file from storage: ', fullPath);
    } catch (error) {
      functions.logger.error(`Failed to delete 1 file: \n${error}`, fullPath);
    }
  });

exports.deleteLibrary = functions.firestore
  .document('firebase_users/{uid}/libraries/{libraryID}')
  .onDelete(async (snap) => {
    const batchSize = 50;
    const { id: libraryID } = snap;

    functions.logger.log(
      `Deleting ${libraryID} library and its subcollection: ${snap.ref.collection('images').path}`
    );

    const collectionRef = snap.ref.collection('images');
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

  const batchSize = snapshot.size;

  functions.logger.log(
    `Deleting the next batch of ${batchSize} image documents in the recently deleted library`
  );

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
