import { useRef } from 'react';

export interface FileUploadProps {
  onChange: (files: File[]) => void;
}

export default function FileUploadButton({ onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input
        ref={inputRef}
        multiple
        id="select-files"
        type="file"
        accept="image/*"
        className="w-0 h-0 overflow-hidden cursor-pointer"
        onChange={() => {
          if (inputRef?.current?.files) {
            onChange(Array.from(inputRef.current.files));
          }
        }}
      />
      <label htmlFor="select-files" className="cursor-pointer inline-block w-full">
        Upload...
      </label>
    </>
  );
}
