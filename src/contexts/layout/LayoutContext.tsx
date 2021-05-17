import { createContext } from 'react';

type LayoutContextType = {
  navigationVisible: boolean;
  toggleNavigation: (val?: boolean) => void;
  propertiesVisible: boolean;
  toggleProperties: (val?: boolean) => void;
  isMobile: boolean;
};

export const LayoutContext = createContext<LayoutContextType>({
  navigationVisible: true,
  toggleNavigation: () => console.warn('Missing context provider'),
  propertiesVisible: true,
  toggleProperties: () => console.warn('Missing context provider'),
  isMobile: false,
});
