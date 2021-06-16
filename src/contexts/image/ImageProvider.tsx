import { useState, useCallback } from 'react';

import { ProviderProps, Image, Images } from '../../interfaces';
import { ImageContext } from './ImageContext';
import { deleteImages } from '../../server/service';

import ProgressBar from '../../components/ProgressBar';
import Slide from '../../components/Slide';

export default function ImageProvider({ children }: ProviderProps) {
  const [selecting, setSelecting] = useState(false);
  const [selection, setSelection] = useState<{ [imageID: string]: Image | undefined }>({});
  const [images, setImages] = useState<Images>();
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

  const startSelecting = useCallback(() => {
    setSelecting(true);
  }, []);

  const cancelSelecting = useCallback(() => {
    setSelection({});
    setSelecting(false);
  }, []);

  const select = useCallback((image: Image) => {
    setSelection((prev) => ({ ...prev, [image.id]: !prev[image.id] ? image : undefined }));
  }, []);

  const deleteSelection = useCallback(() => {
    let deleteCount = 0;

    const images = Object.values(selection).filter((image) => !!image) as Image[];

    const onNext = () => {
      deleteCount += 1;
      setProgress(Math.floor((deleteCount / images.length) * 100));
      if (deleteCount < images.length) {
        setProgressMessage(`Deleting (${deleteCount + 1}/${images.length})`);
      }
    };

    if (images.length) {
      setProgressing(true);
      setProgressMessage(`Deleting (${deleteCount + 1}/${images.length})`);

      deleteImages(images, onNext, onProgressComplete);
      cancelSelecting();
    }
  }, [cancelSelecting, onProgressComplete, selection]);

  return (
    <ImageContext.Provider
      value={{
        selecting,
        startSelecting,
        cancelSelecting,
        selection,
        select,
        images,
        setImages,
        focused: focused ? images?.images?.[focused.id] : undefined,
        focus: setFocused,
        deleteSelection,
        slideVisible,
        toggleSlide: () => toggleSlide(!slideVisible),
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
