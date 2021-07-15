import { useContext } from 'react';
import LayoutContext from './LayoutContext';
import LayoutProvider from './LayoutProvider';

const useLayout = () => {
  const layout = useContext(LayoutContext);
  if (layout === undefined) {
    throw new Error('Missing layout context provider');
  }

  return layout;
};

export { LayoutProvider, useLayout };
