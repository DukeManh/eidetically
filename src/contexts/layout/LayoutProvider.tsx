import React, { useContext, useEffect } from 'react';
import { LayoutContext } from './LayoutContext';
import { useLocalStorage, useMedia } from 'react-use';
import { SidebarLayout } from '../../interfaces';

const BreakPoints = { sm: 640, md: 768, lg: 1024 };

type PropsType = {
  children: React.ReactNode;
};

export function LayoutProvider({ children }: PropsType) {
  const isMobile = useMedia(`(max-width: ${BreakPoints.lg}px)`);

  const DefaultSidebarLayout: SidebarLayout = {
    visible: !isMobile,
    width: 250,
  };

  const [navigationLayout, setNavigationLayout] = useLocalStorage(
    'layout:navigation',
    DefaultSidebarLayout
  );

  const navigation = navigationLayout || DefaultSidebarLayout;

  // Make sure gallery has a min width of 768px when resizing sidebars
  const maxNavigationWidth = (visible = properties.visible) => {
    if (!window) {
      return 0;
    }

    return window.innerWidth - (visible ? properties.width : 0) - BreakPoints.sm;
  };
  const maxPropertiesWidth = (visible = navigation.visible) => {
    if (!window) {
      return 0;
    }

    return window.innerWidth - (visible ? navigation.width : 0) - BreakPoints.sm;
  };

  const [propertiesLayout, setPropertiesLayout] = useLocalStorage(
    'layout:properties',
    DefaultSidebarLayout
  );

  const properties = propertiesLayout || DefaultSidebarLayout;

  const updateProperties = (props: Partial<SidebarLayout>) => {
    const adjustedNavigationWidth = maxNavigationWidth(true);
    if (props.visible && navigation.width > adjustedNavigationWidth) {
      updateNavigation({ width: adjustedNavigationWidth });
    }
    setPropertiesLayout({
      ...properties,
      ...props,
      width: props?.width ? (props.width >= 250 ? props.width : 250) : properties.width,
    });
  };

  const updateNavigation = (props: Partial<SidebarLayout>) => {
    const adjustedPropertiesWidth = maxPropertiesWidth(true);
    if (props.visible && properties.width > adjustedPropertiesWidth) {
      updateProperties({ width: adjustedPropertiesWidth });
    }

    setNavigationLayout({
      ...navigation,
      ...props,
      width: props?.width ? (props.width >= 250 ? props.width : 250) : navigation.width,
    });
  };

  // Toggle sidebar on and off if isMobile
  useEffect(
    () => {
      updateNavigation({ visible: !isMobile });
      updateProperties({ visible: !isMobile });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile]
  );

  useEffect(() => {
    const adjustWidthOnWindowResize = () => {
      if (!isMobile) {
        if (navigation.width > maxNavigationWidth()) {
          updateNavigation({ width: maxNavigationWidth() });
        }
        if (properties.width > maxPropertiesWidth()) {
          updateProperties({ width: maxPropertiesWidth() });
        }
      }
    };
    if (window) {
      window.addEventListener('resize', adjustWidthOnWindowResize);
    }

    return () => {
      window.removeEventListener('resize', adjustWidthOnWindowResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, navigation.width, properties.width]);

  return (
    <LayoutContext.Provider
      value={{
        navigation,
        properties,
        updateProperties,
        updateNavigation,
        isMobile,
        maxNavigationWidth,
        maxPropertiesWidth,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);
