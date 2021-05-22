import React, { useState, useCallback } from 'react';
import { ImageContext } from './ImageContext';
import { ProviderProps, UploadedFile } from '../../interfaces';

export default function ImageProvider({ children }: ProviderProps) {
  const [files, setFiles] = useState<Array<UploadedFile>>([]);

  const uploadFiles = useCallback(
    (acceptedFiles) => {
      setFiles(
        files.concat(
          acceptedFiles.reduce((images: Array<UploadedFile>, file: File) => {
            if (file.type.match(/image\/(jpe?g|png|gif|svg\+xml|webp|avif|apng)/gi)) {
              images.push(Object.assign(file, { preview: URL.createObjectURL(file) }));
            }
            return images;
          }, [])
        )
      );
    },
    [files]
  );

  return (
    <ImageContext.Provider value={{ images: files, uploadFiles }}>{children}</ImageContext.Provider>
  );
}
