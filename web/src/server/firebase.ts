import { initializeApp } from 'firebase/app';
import * as firebaseui from 'firebaseui';

import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {
  getFirestore,
  collection,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

import { Library, Image } from '../interfaces';

const {
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID,
  REACT_APP_MEASUREMENT_ID,
} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID,
  measurementId: REACT_APP_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const typeConverter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot) => snapshot.data() as T,
});

export { firebaseApp };
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const db = {
  libraries: () => {
    if (!auth?.currentUser?.uid) {
      throw new Error('Please sign in');
    }
    return collection(
      firestore,
      `firebase_users/${auth.currentUser.uid}/libraries`
    ).withConverter<Library>(typeConverter<Library>());
  },
  images: (libID: string) => {
    if (!auth?.currentUser?.uid) {
      throw new Error('Please sign in');
    }
    return collection(
      firestore,
      `firebase_users/${auth.currentUser.uid}/libraries/${libID}/images`
    ).withConverter<Image>(typeConverter<Image>());
  },
};

export const authUI = new firebaseui.auth.AuthUI(auth);
