import { useState, useEffect } from 'react';
import { ProviderProps, Library, Image } from '../../interfaces';
import { LibraryContext } from './LibraryContext';
import { useAuth } from '../auth';
import { db } from '../../server/firebase';

export default function LibraryProvider({ children }: ProviderProps) {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [activeLibrary, setActive] = useState<Library | undefined>(undefined);
  const [images, setImages] = useState<{ [key: string]: Image[] }>({});
  const { user } = useAuth();

  // Load a library's images if it's active
  useEffect(() => {
    if (activeLibrary && !images[activeLibrary.id]) {
      const imagesRef = db.images
        .where('library', '==', db.libraries.doc(activeLibrary.id))
        .orderBy('upload_date');
      imagesRef.onSnapshot((snapshot) => {
        const libImages = snapshot.docs.map((image) => {
          return { id: image.id, ...image.data() } as Image;
        });
        setImages({ ...images, [activeLibrary.id]: libImages });
      });
    }
  }, [activeLibrary, images]);

  // Make the first lib the default active lib
  useEffect(() => {
    if (libraries?.length && !activeLibrary) {
      setActive(libraries[0]);
    }
  }, [activeLibrary, libraries]);

  const setActiveLibrary = (id: string | undefined) => {
    const active = libraries.find((lib) => lib.id === id);
    if (active) {
      setActive(active);
    }
  };

  useEffect(() => {
    let unsubscribe;
    if (user) {
      const librariesRef = db.libraries.where('owner', '==', user.uid).orderBy('name');
      unsubscribe = librariesRef.onSnapshot((snapshot) => {
        const nextLibraries = snapshot.docs.map(
          (lib) => ({ ...lib.data(), id: lib.id } as Library)
        );
        setLibraries(nextLibraries);
        snapshot.docChanges().every((change) => {
          if (change.type === 'added') {
            setActive({ ...change.doc.data(), id: change.doc.id } as Library);
            return false;
          }
          return true;
        });
      });
    } else {
      setLibraries([]);
      setActiveLibrary(undefined);
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <LibraryContext.Provider value={{ libraries, activeLibrary, setActiveLibrary, images }}>
      {children}
    </LibraryContext.Provider>
  );
}
