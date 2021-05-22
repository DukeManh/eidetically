import { createContext } from 'react';
import { ImageContextType } from '../../interfaces';

export const ImageContext = createContext<ImageContextType | undefined>(undefined);
