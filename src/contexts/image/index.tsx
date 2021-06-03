import { useContext } from 'react';
import { ImageContext } from './ImageContext';
import ImageProvider from './ImageProvider';

const useImage = () => {
  const library = useContext(ImageContext);
  if (library === undefined) {
    throw new Error('Missing image context provider');
  }
  return library;
};

export { useImage, ImageProvider };
