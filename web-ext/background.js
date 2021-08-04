/* eslint-disable no-undef */

/* Using var to make background variables available to the popup script */
/* eslint-disable no-var */
var firebaseConfig = {
  apiKey: 'AIzaSyCUgKWDq2dxiXW3SYBFknfXka7DpYMGacw',
  authDomain: 'dropit-7ae30.firebaseapp.com',
  projectId: 'dropit-7ae30',
  storageBucket: 'dropit-7ae30.appspot.com',
  messagingSenderId: '675893299238',
  appId: '1:675893299238:web:c9c4c45ba367eb019ebee7',
  measurementId: 'G-WG0RKKDP9F',
};

var app = firebase.initializeApp(firebaseConfig);
var auth = app.auth();
var storage = app.storage();
var db = app.firestore();

function signInWithPopup(providerId) {
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

  if (!provider) {
    return;
  }

  // eslint-disable-next-line consistent-return
  return auth.signInWithPopup(provider).catch((error) => {
    console.error(error);
  });
}

async function uploadImage(file, libraryId) {
  if (!auth.currentUser) {
    throw new Error('Please login to upload images');
  }
  const filePath = `${auth.currentUser.uid}/${libraryId}/${file.name}`;
  storage
    .ref(filePath)
    .put(file)
    .catch((error) => {
      console.error(error);
    });
}

async function getLibraries() {
  if (!auth.currentUser) {
    throw new Error('Please login');
  }

  const librariesRef = db
    .collection('libraries')
    .where('owner', '==', auth.currentUser.uid)
    .orderBy('name');
  const response = await librariesRef.get();
  const snapshots = response.docs;
  const libs = snapshots.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
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

chrome.runtime.onMessage.addListener((message, _, sendMessage) => {
  switch (message.command) {
    case 'getUser':
      if (!auth.currentUser) {
        sendMessage({
          status: 'failed',
          message: "Please sign in to start 'Dragging 'n Dropping'",
          payload: {
            user: null,
          },
        });
      } else {
        sendMessage({
          status: 'success',
          payload: {
            user: auth.currentUser,
          },
        });
      }
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
          uploadImage(file, message.payload.libraryId)
            .then(() => {
              sendMessage({
                status: 'success',
              });
            })
            .catch((error) => {
              sendMessage({
                status: 'failure',
                message: error.message,
              });
            });
        })
        .catch((error) => {
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
