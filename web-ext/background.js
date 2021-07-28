var firebaseConfig = {
  apiKey: 'AIzaSyCUgKWDq2dxiXW3SYBFknfXka7DpYMGacw',
  authDomain: 'dropit-7ae30.firebaseapp.com',
  projectId: 'dropit-7ae30',
  storageBucket: 'dropit-7ae30.appspot.com',
  messagingSenderId: '675893299238',
  appId: '1:675893299238:web:c9c4c45ba367eb019ebee7',
  measurementId: 'G-WG0RKKDP9F',
};

var fire = firebase;
var app = firebase.initializeApp(firebaseConfig);
var auth = app.auth();

function signInWithPopup(providerId) {
  console.log(auth.currentUser);
  let provider;
  console.log(providerId);
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

  return auth.signInWithPopup(provider).catch((error) => {
    console.log(error);
  });
}

function logOut(){
  return auth.signOut();
}

chrome.runtime.onMessage.addListener((message, sender, sendMessage) => {
  switch (message.command) {
    case 'getUser':
      if (!auth.currentUser) {
        sendMessage({
          status: 'failed',
          message: 'User not logged in',
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
      getLibs().then((libs) => {
        if (!libs) {
          sendMessage({
            status: 'failed',
          });
        } else {
          sendMessage({
            status: 'success',
            payload: {
              libs,
            },
          });
        }
      });
      break;
    default:
      break;
  }
  return true;
});