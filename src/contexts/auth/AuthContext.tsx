import { createContext } from 'react';
import { AuthContextType } from '../../interfaces';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
