import { useState, useEffect } from 'react';
import { ProviderProps, Library, Image } from '../../interfaces';
import { LibraryContext } from './LibraryContext';
import { useAuth } from '../auth';
import { db } from '../../server/firebase';
import ProgressBar from '../../components/ProgressBar';
import { uploadImages } from '../../server/service';

export default function LibraryProvider({ children }: ProviderProps) {
  const { user } = useAuth();
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [activeLibrary, setActive] = useState<Library | undefined>(undefined);
  const [images, setImages] = useState<{ [key: string]: Image[] }>({});
  const [uploading, setUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [uploadingMessage, setUploadingMessage] = useState('');

  const upload = (acceptedFiles: File[], libraryID?: string) => {
    if (activeLibrary?.id || libraryID) {
      setUploading(true);
      let uploadedCount = 0;
      setUploadingMessage(`Uploading (${uploadedCount + 1}/${acceptedFiles.length})`);

      const onNext = () => {
        uploadedCount += 1;
        setUploadingProgress(Math.floor((uploadedCount / acceptedFiles.length) * 100));
        setUploadingMessage(`Uploading (${uploadedCount + 1}/${acceptedFiles.length})`);
      };

      const onComplete = (count: number) => {
        console.log('uploaded ', count, ' files');
        setUploading(false);
        setUploadingMessage('');
        setUploadingProgress(0);
      };

      if (libraryID) {
        uploadImages(acceptedFiles, libraryID, onNext, onComplete);
      } else if (activeLibrary?.id) {
        uploadImages(acceptedFiles, activeLibrary.id, onNext, onComplete);
      }
    }
  };

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
    <LibraryContext.Provider
      value={{ libraries, activeLibrary, setActiveLibrary, images, uploadImages: upload }}
    >
      {uploading && (
        <ProgressBar progress={uploadingProgress}>
          <div className="text-center my-auto">{uploadingMessage}</div>
        </ProgressBar>
      )}
      {children}
    </LibraryContext.Provider>
  );
}
