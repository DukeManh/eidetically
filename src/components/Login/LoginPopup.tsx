import { useEffect } from 'react';
import firebase from 'firebase/app';
import { GrClose } from 'react-icons/gr';

import { authUI } from '../../server/firebase';
import { useAuth } from '../../contexts';

import Mask from '../Mask';

export default function LoginPopup() {
  const { loginVisible, setLoginVisible } = useAuth();
  const { user } = useAuth();

  useEffect(() => {
    if (!user && loginVisible) {
      authUI.start('.google-login', {
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        ],
        popupMode: true,
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: () => false,
        },
      });
    }
  }, [loginVisible, user]);

  return (
    <>
      {loginVisible && (
        <>
          <Mask visible={true} onClick={() => setLoginVisible(!loginVisible)} zIndex={50} />
          <div className="py-8 w-80 h-96 fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 bg-white text-primary rounded-md shadow-lg">
            <p className="text-center font-bold text-lg">Login</p>
            <div className="google-login"></div>
            <GrClose
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setLoginVisible(false)}
            />
          </div>
        </>
      )}
    </>
  );
}
