import React, { useState, useRef, useEffect } from 'react';
import { StorageContext } from './StorageContext';
import { ProviderProps, Library } from '../../interfaces';
import { useFirestoreCollectionData, useFirestore } from 'reactfire';

export default function StorageProvider({ children }: ProviderProps) {
  const librariesRef = useFirestore().collection('libraries').orderBy('name');
  const { data: libraries } = useFirestoreCollectionData<Library>(librariesRef, {
    idField: 'id',
  });

  const [activeLibrary, setActive] = useState<Library | undefined>(undefined);

  useEffect(() => {
    if (libraries?.length && !activeLibrary) {
      setActive(libraries[0]);
    }
  }, [activeLibrary, libraries]);

  const setActiveLibrary = (id: string) => {
    const active = libraries.find((lib) => lib.id === id);
    if (active) {
      setActive(active);
    }
  };

  const uploadFiles = (uploadedFiles: File[]) => {
    // const acceptableFiles = uploadedFiles.reduce((images: Array<UploadedFile>, file: File) => {
    //       if (file.type.match(/image\/(jpe?g|png|gif|svg\+xml|webp|avif|apng)/gi)) {
    //         images.push(Object.assign(file, { preview: URL.createObjectURL(file) }));
    //       }
    //       return images;
    // setStorage({
    //   ...storage,
    //   [activeLibrary]: {
    //     ...storage[activeLibrary],
    //     images: acceptedFiles.reduce((images: Array<UploadedFile>, file: File) => {
    //       if (file.type.match(/image\/(jpe?g|png|gif|svg\+xml|webp|avif|apng)/gi)) {
    //         images.push(Object.assign(file, { preview: URL.createObjectURL(file) }));
    //       }
    //       return images;
    //     }, []),
    //   },
    // });
  };

  const ref = useRef<HTMLInputElement>(null);

  const selectFiles = () => {
    if (ref?.current) {
      ref.current.click();
    }
  };

  return (
    <StorageContext.Provider
      value={{ libraries, uploadFiles, selectFiles, activeLibrary, setActiveLibrary }}
    >
      {children}
      <input
        ref={ref}
        multiple
        type="file"
        name="select"
        className="hidden"
        onChange={() => {
          if (ref?.current?.files) {
            uploadFiles(Array.from(ref.current.files));
          }
        }}
      />
    </StorageContext.Provider>
  );
}
