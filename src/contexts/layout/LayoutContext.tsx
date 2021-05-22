import { createContext } from 'react';
import { LayoutContextType } from '../../interfaces';

const LayoutContext = createContext<LayoutContextType | undefined>({} as LayoutContextType);

export default LayoutContext;
