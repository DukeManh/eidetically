import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { ProviderProps, Library } from '../../interfaces';
import { LibraryContext } from './LibraryContext';
import { useAuth } from '../auth';
import { db } from '../../server/firebase';
import { uploadImages } from '../../server/service';

export default function LibraryProvider({ children }: ProviderProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [activeLibrary, setActive] = useState<Library | undefined>(undefined);

  useEffect(() => {
    if (location.pathname === '/') {
      setActive(undefined);
    }
  }, [location]);

  const upload = useCallback(
    (acceptedFiles: File[], libraryID?: string) => {
      if (activeLibrary?.id || libraryID) {
        if (libraryID) {
          uploadImages(acceptedFiles, libraryID);
        } else if (activeLibrary?.id) {
          uploadImages(acceptedFiles, activeLibrary.id);
        }
      }
    },
    [activeLibrary]
  );

  const setActiveLibrary = (id: string | undefined) => {
    const active = libraries.find((lib) => lib.id === id);
    if (active) {
      setActive(active);
      return;
    }
    setActive(undefined);
  };

  useEffect(() => {
    let unsubscribe;
    if (user) {
      setLoading(true);
      const librariesRef = db.libraries().orderBy('name');
      unsubscribe = librariesRef.onSnapshot((snapshot) => {
        const nextLibraries = snapshot.docs.map(
          (lib) => ({ ...lib.data(), id: lib.id } as Library)
        );
        setLibraries(nextLibraries);
        setLoading(false);
      });
    } else {
      setLibraries([]);
      setActiveLibrary(undefined);
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
