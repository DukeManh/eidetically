import { useState, useCallback, useEffect } from 'react';
import { ProviderProps, Image, Images } from '../../interfaces';
import { ImageContext } from './ImageContext';
import { useLibrary } from '../library';
import { db } from '../../server/firebase';
import { deleteImages } from '../../server/service';
import ProgressBar from '../../components/ProgressBar';
import Slide from '../../components/Slide';

export default function ImageProvider({ children }: ProviderProps) {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<{ [imageID: string]: Image | undefined }>({});
  const [images, setImages] = useState<Images>({});
  const { activeLibrary } = useLibrary();
  const [focused, setFocused] = useState<Image | undefined>(undefined);
  const [progressing, setProgressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [slideVisible, toggleSlide] = useState(false);
  const onProgressComplete = useCallback(() => {
    setTimeout(() => {
      setProgressing(false);
      setProgressMessage('');
      setProgress(0);
    }, 2000);
  }, []);

  // Load the active lib's images
  useEffect(() => {
    if (activeLibrary && !images[activeLibrary.id]) {
      const imagesRef = db.libraries
        .doc(activeLibrary.id)
        .collection('images')
        .orderBy('upload_date');
      imagesRef.onSnapshot((snapshot) => {
        const libImages: { [imageID: string]: Image } = {};
        snapshot.docs.forEach((image) => {
          libImages[image.id] = { id: image.id, ...image.data() } as Image;
        });
        setImages({ ...images, [activeLibrary.id]: libImages });
      });
    }
  }, [activeLibrary, images]);

  const startSelecting = useCallback(() => {
    setSelecting(true);
  }, []);

  const cancelSelecting = useCallback(() => {
    setSelected({});
    setSelecting(false);
  }, []);

  const select = useCallback(
    (image: Image) => {
      setSelected({ ...selected, [image.id]: !selected[image.id] ? image : undefined });
    },
    [selected]
  );

  const deleteSelection = () => {
    const images = Object.values(selected).filter((image) => !!image) as Image[];
    if (images.length) {
      setProgressing(true);
      let deleteCount = 0;
      setProgressMessage(`Deleting (${deleteCount + 1}/${images.length})`);

      const onNext = () => {
        deleteCount += 1;
        setProgress(Math.floor((deleteCount / images.length) * 100));
        if (deleteCount < images.length) {
          setProgressMessage(`Deleting (${deleteCount + 1}/${images.length})`);
        }
      };

      deleteImages(images, onNext, onProgressComplete);
      cancelSelecting();
    }
  };

  return (
    <ImageContext.Provider
      value={{
        selecting,
        startSelecting,
        cancelSelecting,
        selected,
        select,
        images,
        focused: focused ? images?.[focused.library.id]?.[focused.id] : undefined,
        focus: setFocused,
        deleteSelection,
        slideVisible,
        toggleSlide: () => toggleSlide(!slideVisible),
        activeImages: activeLibrary ? images?.[activeLibrary.id] || {} : {},
      }}
    >
      {progressing && (
        <ProgressBar progress={progress}>
          <div className="text-center my-auto">{progressMessage}</div>
        </ProgressBar>
      )}
      {slideVisible && <Slide />}
      {children}
    </ImageContext.Provider>
  );
}
