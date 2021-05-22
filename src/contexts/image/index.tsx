import { useContext } from 'react';
import { ImageContext } from './ImageContext';
import ImageProvider from './ImageProvider';

const useImage = () => {
  const image = useContext(ImageContext);
  if (image === undefined) {
    throw new Error('Missing image context provider');
  }
  return image;
};

export { useImage, ImageProvider };
