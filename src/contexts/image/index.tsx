import { useContext } from 'react';
import { LibraryContext } from './LibraryContext';
import LibraryProvider from './LibraryProvider';

const useLibrary = () => {
  const library = useContext(LibraryContext);
  if (library === undefined) {
    throw new Error('Missing image context provider');
  }
  return library;
};

export { useLibrary, LibraryProvider };
