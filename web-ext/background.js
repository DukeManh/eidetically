/* eslint-disable no-undef */

let app;
let auth;
let storage;
let db;

async function initialize() {
  const firebaseConfig = {
    apiKey: 'AIzaSyCUgKWDq2dxiXW3SYBFknfXka7DpYMGacw',
    authDomain: 'dropit-7ae30.firebaseapp.com',
    projectId: 'dropit-7ae30',
    storageBucket: 'dropit-7ae30.appspot.com',
    messagingSenderId: '675893299238',
    appId: '1:675893299238:web:c9c4c45ba367eb019ebee7',
    measurementId: 'G-WG0RKKDP9F',
  };

  app = firebase.initializeApp(firebaseConfig);
  auth = app.auth();
  storage = app.storage();
  db = app.firestore();
}

async function signInWithPopup(providerId) {
  if (!auth) {
    initialize();
  }
  let provider;
  switch (providerId) {
    case 'google.com':
      provider = new firebase.auth.GoogleAuthProvider();
      break;
    case 'facebook.com':
      provider = new firebase.auth.FacebookAuthProvider();
      break;
    case 'github.com':
      provider = new firebase.auth.GithubAuthProvider();
      break;
    default:
      break;
  }

  chrome.tabs.query({ url: 'https://eidetically.vercel.app/*' }, (tabs) => {
    if (tabs.length) {
      console.log(tabs[0].url);
    }
  });

  if (provider) {
    console.log(app);
    auth
      .signInWithPopup(provider)
      .then((authObj) => {
        console.log(authObj);
        console.log(firebase.auth.AuthCredential);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

function getUser() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['auth', 'saved'], (res) => {
      resolve(res?.auth?.currentUser);
    });
  });
}

async function uploadImage(image, source, libraryId) {
  if (!auth.currentUser) {
    throw new Error('Please login to upload images');
  }

  const resizer = ImageBlobReduce();
  const previewBlob = await resizer.toBlob(image, { max: 800 });
  const previewImage = new File([previewBlob], image.name, {
    type: image.type,
  });

  const uuid = uuidv4();
  const filePath = `${auth.currentUser.uid}/${libraryId}/${uuid}`;
  const previewPath = `${filePath}-preview`;

  return Promise.all([
    storage.ref(filePath).put(image, {
      customMetadata: {
        name: image.name,
        isPreview: 'false',
        source,
      },
    }),
    storage.ref(previewPath).put(previewImage, {
      customMetadata: {
        name: image.name,
        isPreview: 'true',
        source,
      },
    }),
  ]).catch((error) => {
    console.error(error);
  });
}

async function getLibraries() {
  if (!auth.currentUser) {
    throw new Error('Please login');
  }

  const librariesRef = db
    .collection(`firebase_users/${auth.currentUser.uid}/libraries`)
    .orderBy('name');
  const response = await librariesRef.get();
  const snapshots = response.docs;
  const libs = snapshots.map((doc) => ({ id: doc.id, ...doc.data() }));
  return libs;
}

async function fileFromUrl(url, name) {
  const image = await fetch(url);
  const blob = await image.blob();

  return new File([blob], name, {
    lastModified: Date.now(),
    type: blob.type,
  });
}

try {
  importScripts(
    './scripts/utils/uuidv4.min.js',
    './scripts/utils/image-blob-reduce.js',
    './scripts/utils/firebase-app.js',
    './scripts/utils/firebase-auth.js',
    './scripts/utils/firebase-firestore.js',
    './scripts/utils/firebase-storage.js'
  );

  initialize();
} catch (e) {
  console.log(e);
}

// Catch unhandled service worker registration error
try {
  chrome.runtime.onMessage.addListener((message, _, sendMessage) => {
    switch (message.command) {
      case 'getUser':
        getUser()
          .then((user) => {
            sendMessage({
              status: 'success',
              payload: {
                user,
              },
            });
          })
          .catch((error) => {
            console.error(error);
            sendMessage({
              status: 'failed',
              message: 'Error fetching user information',
            });
          });
        break;
      case 'signIn':
        signInWithPopup(message.payload.providerId);
        break;
      case 'signOut':
        auth.signOut();
        sendMessage({ status: 'success' });
        break;
      case 'getLibs':
        getLibraries()
          .then((libs) => {
            sendMessage({
              status: 'success',
              payload: {
                libs,
              },
            });
          })
          .catch((error) => {
            console.error(error);
            sendMessage({
              status: 'failure',
              message: error.message,
              payload: {
                libs: null,
              },
            });
          });
        break;
      case 'uploadImage':
        fileFromUrl(message.payload.url, message.payload.name)
          .then((file) => {
            uploadImage(file, message.payload.url, message.payload.libraryId)
              .then(() => {
                sendMessage({
                  status: 'success',
                });
              })
              .catch((error) => {
                console.error(error);
                sendMessage({
                  status: 'failure',
                  message: error.message,
                });
              });
          })
          .catch((error) => {
            console.error(error);
            sendMessage({
              status: 'failure',
              message: error.message,
            });
          });
        break;
      default:
        break;
    }
    return true;
  });
} catch (error) {
  console.error(error);
}
