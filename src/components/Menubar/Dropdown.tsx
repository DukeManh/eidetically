import { useRef } from 'react';
import { useStorage } from '../../contexts';

export default function Dropdown({ options }: { options: string[] }) {
  const ref = useRef<HTMLInputElement>(null);
  const { uploadFiles } = useStorage();
  return (
    <div
      className="menu-dropdown absolute z-50 bg-dropdown rounded-b-lg w-56 text-white min-h"
      style={{ top: 'calc(100% + 1px)' }}
    >
      <div className="flex flex-col py-2">
        {options.map((option) => (
          <button key={option} className="w-full hover:bg-blue-500 text-left pl-4 mt-1">
            {option}
          </button>
        ))}
        <button
          onClick={() => {
            if (ref?.current) ref.current.click();
          }}
          className="w-full hover:bg-blue-500 text-left pl-4 mt-1"
        >
          <input
            ref={ref}
            multiple
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => {
              if (ref?.current?.files) {
                uploadFiles(Array.from(ref.current.files));
              }
            }}
          />
          Upload Files
        </button>
      </div>
    </div>
  );
}
