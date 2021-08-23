import { useEffect, useState } from 'react';
import { useLocalStorage, useMedia } from 'react-use';

import { ProviderProps } from '../../interfaces';
import LayoutContext from './LayoutContext';
import { on, off } from '../../utilities/';

const BreakPoints = { sm: 640, md: 768, lg: 1024 };
const MaxZoom = 10;
const DefaultSidebarWidth = 250;

export default function LayoutProvider({ children }: ProviderProps) {
  const isMobile = useMedia(`(max-width: ${BreakPoints.lg}px)`);
  const defaultZoom = isMobile ? 1 : 3;
  const [propertiesVisible, setPropertiesVisible] = useLocalStorage('propertiesVisible', !isMobile);
  const [navigationVisible, setNavigationVisible] = useLocalStorage('navigationVisible', !isMobile);
  const [navigationWidth, setNavigationWidth] = useLocalStorage(
    'navigationWidth',
    DefaultSidebarWidth
  );
  const [zoom, setZoom] = useLocalStorage('zoom', defaultZoom);
  const [minZoom, setMinZoom] = useState(1);

  useEffect(() => {
    setPropertiesVisible(!isMobile);
    setNavigationVisible(!isMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    const resize = () => {
      if ((navigationWidth ?? DefaultSidebarWidth) + DefaultSidebarWidth * 3 > window.innerWidth) {
        setNavigationWidth(
          Math.max(DefaultSidebarWidth, window.innerWidth - DefaultSidebarWidth * 3)
        );
      }
    };
    on(window, 'resize', resize);
    return () => {
      off(window, 'resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationWidth]);

  useEffect(() => {
    if (isMobile) {
      setMinZoom(5);
      setZoom((zoom) => Math.max(5, zoom || 0));
    } else {
      setMinZoom(1);
    }
  }, [isMobile, setZoom]);

  return (
    <LayoutContext.Provider
      value={{
        navigationWidth: navigationWidth ?? DefaultSidebarWidth,
        setNavigationWidth,
        navigationVisible: navigationVisible ?? !isMobile,
        setNavigationVisible,
        isMobile,
        DefaultSidebarWidth,
        propertiesVisible: propertiesVisible ?? !isMobile,
        setPropertiesVisible,
        zoom: zoom || defaultZoom,
        maxZoom: MaxZoom,
        minZoom,
        setZoom: (val) => setZoom(Math.min(Math.max(minZoom, val), MaxZoom)),
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
