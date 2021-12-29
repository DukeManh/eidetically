import { useEffect } from 'react';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { GrClose } from 'react-icons/gr';
import { CSSTransition } from 'react-transition-group';

import { authUI } from '../../server/firebase';
import { useAuth } from '../../contexts';
import authui from 'firebaseui';

import Mask from '../Mask';

const authUIConfig: authui.auth.Config = {
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    GithubAuthProvider.PROVIDER_ID,
    FacebookAuthProvider.PROVIDER_ID,
  ],
  signInFlow: 'popup',
  callbacks: {
    signInSuccessWithAuthResult: () => {
      return true;
    },
  },
};

export default function LoginPopup() {
  const { loginVisible, setLoginVisible } = useAuth();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoginVisible(true);
    }
  }, [setLoginVisible, user]);

  useEffect(() => {
    if (!user && loginVisible) {
      authUI.start('.google-login', authUIConfig);
    }
  }, [loginVisible, user]);

  return (
    <>
      <Mask visible={loginVisible} zIndex={100} />
      <CSSTransition in={loginVisible} timeout={200} classNames="scale-transition" unmountOnExit>
        <div className="fixed h-full w-full flex justify-center items-center z-[100]">
          <div className="relative py-8 w-72 h-80  rounded-md shadow-lg bg-white text-primary">
            <p className="text-center font-bold text-lg">Login</p>
            <div className="google-login"></div>
            <GrClose
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setLoginVisible(false)}
            />
          </div>
        </div>
      </CSSTransition>
    </>
  );
}
