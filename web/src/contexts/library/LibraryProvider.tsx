import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ProviderProps, Library } from '../../interfaces';
import { LibraryContext } from './LibraryContext';
import { useAuth } from '../auth';
import { db } from '../../server/firebase';
import { uploadImages } from '../../server/service';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function LibraryProvider({ children }: ProviderProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [active, setActive] = useState<string>('');

  const activeLibrary = useMemo(() => {
    const library = libraries.find((lib) => lib.id === active);
    return library || undefined;
  }, [active, libraries]);

  useEffect(() => {
    if (location.pathname === '/') {
      setActive('');
    }
  }, [location]);

  const upload = useCallback(
    (acceptedFiles: File[], libraryID?: string) => {
      if (libraryID) {
        uploadImages(acceptedFiles, libraryID).catch((error) => {
          toast.error(`Error uploading files: ${error.message}`);
        });
      } else if (activeLibrary?.id) {
        uploadImages(acceptedFiles, activeLibrary.id).catch((error) => {
          toast.error(`Error uploading files: ${error.message}`);
        });
      }
    },
    [activeLibrary]
  );

  const setActiveLibrary = (id: string) => {
    const active = libraries.find((lib) => lib.id === id);
    if (active) {
      setActive(id);
      return;
    }
    setActive('');
  };

  useEffect(() => {
    setLoading(true);
    const librariesRef = query(db.libraries(), orderBy('name'));
    const unsubscribe = onSnapshot(librariesRef, (snapshot) => {
      const nextLibraries = snapshot.docs.map((lib) => ({ ...lib.data(), id: lib.id } as Library));
      setLibraries(nextLibraries);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <LibraryContext.Provider
      value={{
        loading,
        libraries,
        activeLibrary,
        setActiveLibrary,
        uploadImages: upload,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
