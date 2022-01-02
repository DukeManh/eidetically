import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'react-use';
import { onAuthStateChanged } from 'firebase/auth';

import { AuthContext } from './AuthContext';
import { ProviderProps } from '../../interfaces';
import { auth } from '../../server/firebase';
import { LoginPopup } from '../../components/Login';

export default function AuthProvider({ children }: ProviderProps) {
  const [user, setUser] = useState(auth.currentUser);
  const [loginVisible, setLogin] = useState(false);
  const [showOnce, setShowOnce] = useState(false);

  const setLoginVisible = useCallback((val: boolean) => {
    if (val) {
      setShowOnce(true);
    }
    setLogin(val);
  }, []);

  const logout = async () => {
    auth.signOut().then(() => {
      if (window) {
        window.location.href = '/';
      }
    });
  };

  useDebounce(
    () => {
      if (!user && !showOnce) {
        setLoginVisible(true);
      }
    },
    15000,
    [user, showOnce]
  );

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setLoginVisible(false);
      }
    });
  }, [setLoginVisible]);

  return (
    <AuthContext.Provider value={{ user, loginVisible, setLoginVisible, logout }}>
      <LoginPopup />
      {children}
    </AuthContext.Provider>
  );
}
