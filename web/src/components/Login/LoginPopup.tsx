import { useEffect } from 'react';
import firebase from 'firebase/app';
import { GrClose } from 'react-icons/gr';
import { CSSTransition } from 'react-transition-group';

import { authUI } from '../../server/firebase';
import { useAuth } from '../../contexts';

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
    <CSSTransition in={loginVisible} timeout={200} classNames="scale-transition" unmountOnExit>
      <div className="fixed h-full w-full flex justify-center items-center z-[100]">
        <div className="relative py-8 w-80 h-96  rounded-md shadow-lg bg-white text-primary">
          <p className="text-center font-bold text-lg">Login</p>
          <div className="google-login"></div>
          <GrClose
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => setLoginVisible(false)}
          />
        </div>
      </div>
    </CSSTransition>
  );
}
