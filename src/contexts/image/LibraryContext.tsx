import { createContext } from 'react';
import { LibraryContextType } from '../../interfaces';

export const LibraryContext = createContext<LibraryContextType | undefined>(undefined);
