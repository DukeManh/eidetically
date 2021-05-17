import React, { useContext, useEffect } from 'react';
import { LayoutContext } from './LayoutContext';
import useToggle from '../../hooks/use-toggle';
import { useMedia } from 'react-use';

type PropsType = {
  children: React.ReactNode;
};

export function LayoutProvider({ children }: PropsType) {
  const { value: navigationVisible, toggle: toggleNavigation } = useToggle(true);
  const { value: propertiesVisible, toggle: toggleProperties } = useToggle(true);
  const isMobile = useMedia('(max-width: 1024px)');

  useEffect(() => {
    toggleNavigation(!isMobile);
    toggleProperties(!isMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <LayoutContext.Provider
      value={{ navigationVisible, toggleNavigation, propertiesVisible, toggleProperties, isMobile }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);
