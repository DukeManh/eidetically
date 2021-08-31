import { useEffect } from 'react';
import firebase from 'firebase/app';
import { GrClose } from 'react-icons/gr';
import { CSSTransition } from 'react-transition-group';

import { authUI } from '../../server/firebase';
import { useAuth } from '../../contexts';

import Mask from '../Mask';

const authUIConfig = {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  signInFlow: 'popup',
  callbacks: {
    signInSuccessWithAuthResult: () => true,
  },
};

export default function LoginPopup() {
  const { loginVisible, setLoginVisible } = useAuth();
  const { user } = useAuth();

  useEffect(() => {
    if (!user && loginVisible) {
      authUI.start('.google-login', authUIConfig);
    }
  }, [loginVisible, user]);

  return (
    <CSSTransition in={loginVisible} timeout={200} classNames="fade-transition" unmountOnExit>
      <>
        <Mask visible={true} onClick={() => setLoginVisible(!loginVisible)} zIndex={60} />
        <div className="py-8 w-80 h-96 fixed top-1/4 left-1/2 -translate-x-1/2 z-[100] bg-white text-primary rounded-md shadow-lg">
          <p className="text-center font-bold text-lg">Login</p>
          <div className="google-login"></div>
          <GrClose
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => setLoginVisible(false)}
          />
        </div>
      </>
    </CSSTransition>
  );
}
