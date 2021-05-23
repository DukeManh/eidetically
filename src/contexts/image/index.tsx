import { useContext } from 'react';
import { StorageContext } from './StorageContext';
import StorageProvider from './StorageProvider';

const useStorage = () => {
  const image = useContext(StorageContext);
  if (image === undefined) {
    throw new Error('Missing image context provider');
  }
  return image;
};

export { useStorage, StorageProvider };
