import { useContext } from 'react';
import { ImageContext } from './ImageContext';
import ImageProvider from './ImageProvider';

const useImage = () => {
  const images = useContext(ImageContext);
  if (images === undefined) {
    throw new Error('Missing image context provider');
  }
  return images;
};

export { useImage, ImageProvider };
