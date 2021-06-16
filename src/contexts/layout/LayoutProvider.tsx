import React, { useEffect } from 'react';
import LayoutContext from './LayoutContext';
import { useLocalStorage, useMedia } from 'react-use';

import { SidebarLayout, ProviderProps } from '../../interfaces';

const BreakPoints = { sm: 640, md: 768, lg: 1024 };

export default function LayoutProvider({ children }: ProviderProps) {
  const isMobile = useMedia(`(max-width: ${BreakPoints.lg}px)`);
  const defaultZoom = isMobile ? 100 : 300;
  const [zoom, setZoom] = useLocalStorage('zoom', defaultZoom);

  const DefaultSidebarLayout: SidebarLayout = {
    visible: !isMobile,
    width: 250,
  };

  const [navigationLayout, setNavigationLayout] = useLocalStorage(
    'layout:navigation',
    DefaultSidebarLayout
  );

  const navigation = navigationLayout || DefaultSidebarLayout;

  // Make sure gallery has a min width of 768px when resizing
  const maxNavigationWidth = (visible = properties.visible) => {
    if (!window) {
      return 0;
    }
    return window.innerWidth - (visible ? properties.width : 0) - BreakPoints.sm;
  };

  const [propertiesLayout, setPropertiesLayout] = useLocalStorage(
    'layout:properties',
    DefaultSidebarLayout
  );

  const properties = propertiesLayout || DefaultSidebarLayout;

  // Make sure gallery has a min width of 768px when resizing
  const maxPropertiesWidth = (visible = navigation.visible) => {
    if (!window) {
      return 0;
    }
    return window.innerWidth - (visible ? navigation.width : 0) - BreakPoints.sm;
  };

  const updateProperties = (props: Partial<SidebarLayout>) => {
    setPropertiesLayout({
      ...properties,
      ...props,
      width: props?.width ? (props.width >= 250 ? props.width : 250) : properties.width,
    });
  };

  const updateNavigation = (props: Partial<SidebarLayout>) => {
    setNavigationLayout({
      ...navigation,
      ...props,
      width: props?.width ? (props.width >= 250 ? props.width : 250) : navigation.width,
    });
  };

  useEffect(() => {
    const adjustWidthOnWindowResize = () => {
      if (!isMobile) {
        updateNavigation({
          width: Math.min(maxNavigationWidth(), navigation.width),
          visible: true,
        });
        updateProperties({
          width: Math.min(maxPropertiesWidth(), properties.width),
          visible: true,
        });
      } else {
        updateProperties({ visible: false });
        updateNavigation({ visible: false });
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
        zoom: zoom || defaultZoom,
        setZoom,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
