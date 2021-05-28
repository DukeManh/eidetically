import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import { User, Library, Image } from '../interfaces';

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

export const firebaseApp = firebase.initializeApp(firebaseConfig);

const typeConverter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot) => snapshot.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  firebase.firestore().collection(collectionPath).withConverter(typeConverter<T>());

export const db = {
  users: dataPoint<User>('users'),
  libraries: dataPoint<Library>('libraries'),
  images: dataPoint<Image>('images'),
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const authUI = new firebaseui.auth.AuthUI(auth);
