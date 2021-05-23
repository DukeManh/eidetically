import { createContext } from 'react';
import { StorageContextType } from '../../interfaces';

export const StorageContext = createContext<StorageContextType | undefined>(undefined);
