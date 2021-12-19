import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { AuthContext } from './AuthContext';
import { ProviderProps } from '../../interfaces';
import { auth } from '../../server/firebase';
import { LoginPopup } from '../../components/Login';

export default function StorageProvider({ children }: ProviderProps) {
  const [user, setUser] = useState(auth.currentUser);
  const [loginVisible, setLoginVisible] = useState(false);

  const logout = () => {
    auth.signOut();
    if (window) {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setLoginVisible(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginVisible, setLoginVisible, logout }}>
      <LoginPopup />
      {children}
    </AuthContext.Provider>
  );
}
