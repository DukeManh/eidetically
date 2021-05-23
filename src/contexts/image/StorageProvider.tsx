import React, { useState, useRef } from 'react';
import { StorageContext } from './StorageContext';
import { ProviderProps, UploadedFile, Storage } from '../../interfaces';

const SampleStorage: Storage = {
  '1': { name: 'Personal website', images: [], id: '1' },
  '2': { name: 'High Def images', images: [], id: '2' },
};

export default function StorageProvider({ children }: ProviderProps) {
  const [storage, setStorage] = useState<Storage>(SampleStorage);
  const [activeLibrary, setActiveLibrary] = useState('1');

  const uploadFiles = (acceptedFiles: File[]) => {
    setStorage({
      ...storage,

      [activeLibrary]: {
        ...storage[activeLibrary],

        images: acceptedFiles.reduce((images: Array<UploadedFile>, file: File) => {
          if (file.type.match(/image\/(jpe?g|png|gif|svg\+xml|webp|avif|apng)/gi)) {
            images.push(Object.assign(file, { preview: URL.createObjectURL(file) }));
          }
          return images;
        }, []),
      },
    });
  };

  const ref = useRef<HTMLInputElement>(null);

  const selectFiles = () => {
    if (ref?.current) {
      ref.current.click();
    }
  };

  return (
    <StorageContext.Provider
      value={{ storage, uploadFiles, selectFiles, activeLibrary, setActiveLibrary }}
    >
      {children}
      <input
        ref={ref}
        multiple
        type="file"
        name="select"
        className="invisible w-0 h-0"
        onChange={() => {
          if (ref?.current?.files) {
            uploadFiles(Array.from(ref.current.files));
          }
        }}
      />
    </StorageContext.Provider>
  );
}
