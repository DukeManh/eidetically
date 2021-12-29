import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

import { ProviderProps, Image, ImageMap, ImageFile } from '../../interfaces';
import { ImageContext } from './ImageContext';
import { deleteImages, uploadImages } from '../../server/service';

import Slide from '../../components/Slide';
import Editor from '../../components/Editor';

export default function ImageProvider({ children }: ProviderProps) {
  const [selecting, setSelecting] = useState(false);
  const [selection, setSelection] = useState<{ [imageID: string]: Image }>({});
  const [imageArray, setImageArray] = useState<Image[][]>([]);
  const [imageMap, setImageMap] = useState<ImageMap>({});
  const [focused, setFocused] = useState<Image | undefined>(undefined);
  const [slideVisible, toggleSlide] = useState(false);
  const [editorVisible, toggleEditor] = useState(false);
  const [clipboard, setClipBoard] =
    useState<{ clipboard: Image[]; operation: 'cut' | 'copy'; fromLibrary: string }>();

  const startSelecting = useCallback(() => {
    setSelecting(true);
  }, []);

  const cancelSelecting = useCallback(() => {
    setSelection({});
    setSelecting(false);
  }, []);

  const select = useCallback((image: Image) => {
    setSelection((prev) => {
      const selection = { ...prev };
      if (selection[image.id]) {
        delete selection[image.id];
      } else {
        selection[image.id] = image;
      }
      return selection;
    });
  }, []);

  const deleteSelection = useCallback(() => {
    const images = Object.values(selection);
    if (images.length) {
      deleteImages(images).catch((error: Error) => {
        toast.error(`Insufficient rights: ${error.message}`);
      });
      cancelSelecting();
    }
  }, [cancelSelecting, selection]);

  const copyToClipboard = useCallback(
    (fromLibrary: string) => {
      setClipBoard({ clipboard: Object.values(selection), operation: 'copy', fromLibrary });
      cancelSelecting();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selection]
  );

  const cutToClipboard = useCallback(
    (fromLibrary: string) => {
      setClipBoard({ clipboard: Object.values(selection), operation: 'cut', fromLibrary });
      cancelSelecting();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selection]
  );

  const paste = useCallback(
    async (toLibrary: string) => {
      if (clipboard) {
        const fetches = clipboard.clipboard.map(async (image) => {
          const img = await fetch(image.downloadURL);
          const blob = await img.blob();
          const file: ImageFile = new File([blob], image.name, {
            lastModified: Date.now(),
            type: blob.type,
          });
          file.metaData = {
            note: image.note,
            source: image.source,
            name: image.name,
          };
          return file;
        });

        await Promise.all(fetches)
          .then((files) => {
            uploadImages(files, toLibrary)
              .then(() => {
                if (clipboard.operation === 'cut') {
                  deleteImages(clipboard.clipboard).catch((error: Error) => {
                    toast.error(`Insufficient rights: ${error.message}`);
                  });
                }
              })
              .catch((error: Error) => {
                toast.error(`Insufficient rights: ${error.message}`);
              });
          })
          .catch(() => console.error('Error fetching medias'));

        setClipBoard(undefined);
      }
    },
    [clipboard]
  );

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
        editorVisible,
        toggleEditor: (val) => toggleEditor(val ?? !editorVisible),
        cutToClipboard,
        copyToClipboard,
        paste,
        clipboard,
      }}
    >
      <Slide />
      <Editor />
      {children}
    </ImageContext.Provider>
  );
}
