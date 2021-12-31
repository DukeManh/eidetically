import { CSSProperties, useEffect } from 'react';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { GrClose } from 'react-icons/gr';
import { Transition } from 'react-transition-group';

import { authUI } from '../../server/firebase';
import { useAuth } from '../../contexts';

import Mask from '../Mask';

const transitionStyles: {
  [state: string]: CSSProperties;
} = {
  entering: { opacity: 0, transform: 'scale(0.6) translate(-30%, 30%)' },
  exiting: { opacity: 0 },
};

const authUIConfig = {
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    GithubAuthProvider.PROVIDER_ID,
    FacebookAuthProvider.PROVIDER_ID,
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
    <>
      <Mask visible={loginVisible} zIndex={100} />
      <Transition in={loginVisible} timeout={200} unmountOnExit exit enter>
        {(state) => (
          <div
            className="fixed h-full w-full flex justify-center items-center z-[100]"
            style={{
              transitionProperty: 'transform, opacity',
              transitionDuration: '200ms',
              transitionTimingFunction: 'ease-in-out',
              opacity: 1,
              transform: 'translate(0, 0) scale(1) ',
              ...transitionStyles[state],
            }}
          >
            <div className="relative py-6 w-72 h-72  rounded-md shadow-lg bg-white text-primary">
              <p className="text-center font-bold text-xl">Sign in</p>
              <div className="google-login mt-y"></div>
              <button
                className="absolute top-2 right-2 buttonIcon p-1"
                onClick={() => setLoginVisible(false)}
              >
                <GrClose className="cursor-pointer" />
              </button>
              <div>
                <p className="agreements">
                  By continuing, you are indicating that you accept Google's{' '}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
}
