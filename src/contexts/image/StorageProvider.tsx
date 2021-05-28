import React, { useState, useEffect } from 'react';
import { StorageContext } from './StorageContext';
import { ProviderProps, Library } from '../../interfaces';

export default function StorageProvider({ children }: ProviderProps) {
  const [libraries] = useState<Library[]>([]);

  const [activeLibrary, setActive] = useState<Library | undefined>(undefined);

  useEffect(() => {
    if (libraries?.length && !activeLibrary) {
      setActive(libraries[0]);
    }
  }, [activeLibrary, libraries]);

  const setActiveLibrary = (id: string | undefined) => {
    if (!id) {
      setActive(undefined);
    }
    const active = libraries.find((lib) => lib.id === id);
    if (active) {
      setActive(active);
    }
  };

  const uploadFiles = (uploadedFiles: File[]) => {
    console.log(uploadedFiles);
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

  return (
    <StorageContext.Provider value={{ libraries, uploadFiles, activeLibrary, setActiveLibrary }}>
      {children}
    </StorageContext.Provider>
  );
}
