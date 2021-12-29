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
  entering: { opacity: 0, transform: 'scale(0.7)', top: '20%', left: '-20%' },
  entered: { opacity: 1, transform: 'scale(1)', top: 0, left: 0 },
  exiting: { opacity: 1 },
  exited: {
    opacity: 0,
  },
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
      <Transition in={loginVisible} timeout={0} unmountOnExit enter appear exit>
        {(state) => {
          console.log(transitionStyles[state]);
          return (
            <div
              className="fixed h-full w-full flex justify-center items-center z-[100]"
              style={{
                ...transitionStyles[state],
                transitionProperty: 'top, left, opacity, transform',
                transitionDuration: '300ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div className="relative py-6 w-72 h-72  rounded-md shadow-lg bg-white text-primary">
                <p className="text-center font-bold text-xl">Sign in</p>
                <div className="google-login mt-y"></div>
                <GrClose
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() => setLoginVisible(false)}
                />
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
          );
        }}
      </Transition>
    </>
  );
}
