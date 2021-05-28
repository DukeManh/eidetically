import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import AuthProvider from './AuthProvider';

const useAuth = () => {
  const user = useContext(AuthContext);
  if (!user) {
    throw new Error('Missing auth context provider');
  }
  return user;
};

export { AuthProvider, useAuth };
