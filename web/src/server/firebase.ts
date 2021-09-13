import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

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

firebase.initializeApp(firebaseConfig);

const typeConverter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot) => snapshot.data() as T,
});

export const collection = <T>(collectionPath: string) =>
  firebase.firestore().collection(collectionPath).withConverter(typeConverter<T>());

export { firebase };
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const db = {
  libraries: () => {
    if (!auth?.currentUser?.uid) {
      throw new Error('Please sign in');
    }
    return collection<Library | Partial<Library>>(
      `firebase_users/${auth.currentUser.uid}/libraries`
    );
  },
  images: (libID: string) => {
    if (!auth?.currentUser?.uid) {
      throw new Error('Please sign in');
    }
    return collection<Image | Partial<Image>>(
      `firebase_users/${auth.currentUser.uid}/libraries/${libID}/images`
    );
  },
};

export const authUI = new firebaseui.auth.AuthUI(auth);
