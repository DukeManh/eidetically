import { useState, useCallback, useMemo } from 'react';

import { ProviderProps, Image, ImageMap } from '../../interfaces';
import { ImageContext } from './ImageContext';
import { deleteImages } from '../../server/service';

import Slide from '../../components/Slide';

export default function ImageProvider({ children }: ProviderProps) {
  const [selecting, setSelecting] = useState(false);
  const [selection, setSelection] = useState<{ [imageID: string]: Image | undefined }>({});
  const [imageArray, setImageArray] = useState<Image[][]>([]);
  const [imageMap, setImageMap] = useState<ImageMap>({});
  const [focused, setFocused] = useState<Image | undefined>(undefined);
  const [slideVisible, toggleSlide] = useState(false);

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
    const images = Object.values(selection).filter((image) => !!image) as Image[];
    if (images.length) {
      deleteImages(images);
      cancelSelecting();
    }
  }, [cancelSelecting, selection]);

  const flattenArray = useMemo(
    () => imageArray.reduce((acc, curr) => acc.concat(curr), []),
    [imageArray]
  );

  const selectedItemsNum = useMemo(
    () => Object.values(selection).filter((image) => !!image).length,
    [selection]
  );

  return (
    <ImageContext.Provider
      value={{
        selectedItemsNum,
        selecting,
        startSelecting,
        cancelSelecting,
        selection,
        select,
        imageArray,
        setImageArray,
        imageMap,
        setImageMap,
        flattenArray,
        focused: focused ? imageMap?.[focused.id] : undefined,
        focus: setFocused,
        deleteSelection,
        slideVisible,
        toggleSlide: (val) => toggleSlide(val ?? !slideVisible),
      }}
    >
      <Slide />
      {children}
    </ImageContext.Provider>
  );
}
