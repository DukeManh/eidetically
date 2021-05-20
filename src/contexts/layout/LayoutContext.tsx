import { createContext } from 'react';
import { LayoutContextType } from '../../interfaces';

export const LayoutContext = createContext<LayoutContextType>({
  navigation: {
    visible: true,
    width: 0,
  },
  updateNavigation: () => console.warn('Missing context provider'),

  properties: {
    visible: true,
    width: 0,
  },
  updateProperties: () => console.warn('Missing context provider'),

  isMobile: false,

  maxNavigationWidth: () => 0,
  maxPropertiesWidth: () => 0,
});
