import { useEffect } from 'react';
import { GrClose } from 'react-icons/gr';
import firebase from 'firebase/app';
import { useLayout } from '../contexts';
import { authUI } from '../server/firebase';
import { useAuth } from '../contexts';

export default function Login() {
  const { loginVisible, setLoginVisible } = useLayout();
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
        signInSuccessUrl: 'http://localhost:8000/',
      });
    }
  }, [loginVisible, user]);

  return (
    <>
      {loginVisible && (
        <div className="py-8 w-80 h-96 fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 bg-white text-primary rounded-md shadow-lg">
          <p className="text-center font-bold text-lg">Login</p>
          <div className="google-login"></div>
          <GrClose
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => setLoginVisible(false)}
          />
        </div>
      )}
    </>
  );
}
