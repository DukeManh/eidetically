import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { ProviderProps } from '../../interfaces';
import { auth } from '../../server/firebase';
import LoginPopup from '../../components/Login/LoginPopup';

export default function StorageProvider({ children }: ProviderProps) {
  const [user, setUser] = useState(auth.currentUser);
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginVisible, setLoginVisible }}>
      <LoginPopup />
      {children}
    </AuthContext.Provider>
  );
}
