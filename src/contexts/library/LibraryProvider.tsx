import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ProviderProps, Library } from '../../interfaces';
import { LibraryContext } from './LibraryContext';
import { useAuth } from '../auth';
import { db } from '../../server/firebase';
import ProgressBar from '../../components/ProgressBar';
import { uploadImages } from '../../server/service';

export default function LibraryProvider({ children }: ProviderProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [activeLibrary, setActive] = useState<Library | undefined>(undefined);
  const [progressing, setProgressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const onProgressComplete = useCallback(() => {
    setTimeout(() => {
      setProgressing(false);
      setProgressMessage('');
      setProgress(0);
    }, 2000);
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      setActive(undefined);
    }
  }, [location]);

  const upload = useCallback(
    (acceptedFiles: File[], libraryID?: string) => {
      if (activeLibrary?.id || libraryID) {
        setProgressing(true);
        let uploadedCount = 0;
        setProgressMessage(`Uploading (${uploadedCount + 1}/${acceptedFiles.length})`);

        const onNext = () => {
          uploadedCount += 1;
          setProgress(Math.floor((uploadedCount / acceptedFiles.length) * 100));
          if (uploadedCount < acceptedFiles.length) {
            setProgressMessage(`Uploading (${uploadedCount + 1}/${acceptedFiles.length})`);
          }
        };

        if (libraryID) {
          uploadImages(acceptedFiles, libraryID, onNext, onProgressComplete);
        } else if (activeLibrary?.id) {
          uploadImages(acceptedFiles, activeLibrary.id, onNext, onProgressComplete);
        }
      }
    },
    [activeLibrary, onProgressComplete]
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
      const librariesRef = db.libraries.where('owner', '==', user.uid).orderBy('name');
      unsubscribe = librariesRef.onSnapshot((snapshot) => {
        const nextLibraries = snapshot.docs.map(
          (lib) => ({ ...lib.data(), id: lib.id } as Library)
        );
        setLibraries(nextLibraries);
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
        libraries,
        activeLibrary,
        setActiveLibrary,
        uploadImages: upload,
      }}
    >
      {progressing && (
        <ProgressBar progress={progress}>
          <div className="text-center my-auto">{progressMessage}</div>
        </ProgressBar>
      )}
      {children}
    </LibraryContext.Provider>
  );
}
