import { useRef, ReactNode } from 'react';

import { useLibrary } from '../contexts';

export interface FileUploadProps {
  children?: ReactNode;
  disabled?: boolean;
}

export default function FileUploadButton({ children, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { uploadImages } = useLibrary();

  return (
    <>
      <input
        disabled={disabled}
        ref={inputRef}
        multiple
        id="select-files"
        type="file"
        accept="image/*"
        className="w-0 h-0 overflow-hidden cursor-pointer"
        onChange={() => {
          if (inputRef?.current?.files) {
            uploadImages(Array.from(inputRef.current.files));
          }
        }}
      />
      <label htmlFor="select-files" className="cursor-pointer inline-block w-full">
        {children}
      </label>
    </>
  );
}
