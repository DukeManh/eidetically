import { useState, useCallback, useEffect } from 'react';
import { ProviderProps, Image, Images } from '../../interfaces';
import { ImageContext } from './ImageContext';
import { useLibrary } from '../library';
import { db } from '../../server/firebase';

export default function ImageProvider({ children }: ProviderProps) {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Image[]>([]);
  const [images, setImages] = useState<Images>({});
  const { activeLibrary } = useLibrary();
  const [focused, setFocused] = useState<Image | undefined>(undefined);

  // Load a library's images if it's active
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
    setSelected([]);
    setSelecting(false);
  }, []);

  const select = useCallback(
    (image: Image) => {
      if (!selected.some((i) => i.id === image.id)) {
        setSelected(selected.concat(image));
      }
    },
    [selected]
  );

  const deselect = useCallback(
    (image: Image) => {
      setSelected(selected.filter((i) => i.id !== image.id));
    },
    [selected]
  );

  return (
    <ImageContext.Provider
      value={{
        selecting,
        startSelecting,
        cancelSelecting,
        selected,
        select,
        deselect,
        images,
        focused: focused ? images[focused.library.id][focused.id] : undefined,
        focus: setFocused,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
