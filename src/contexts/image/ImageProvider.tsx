import React, { useState, useCallback, useRef } from 'react';
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

  const ref = useRef<HTMLInputElement>(null);

  const selectFiles = () => {
    if (ref?.current) {
      ref.current.click();
    }
  };

  return (
    <ImageContext.Provider value={{ images: files, uploadFiles, selectFiles }}>
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
    </ImageContext.Provider>
  );
}
