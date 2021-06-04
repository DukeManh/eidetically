import { useRef } from 'react';
import { useLibrary } from '../../contexts';

export default function Dropdown({ options }: { options: string[] }) {
  const { activeLibrary, uploadImages } = useLibrary();

  const ref = useRef<HTMLInputElement>(null);
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
        <button className="w-full hover:bg-blue-500 text-left pl-4 mt-1">
          <input
            ref={ref}
            multiple
            id="select-files"
            type="file"
            accept="image/*"
            className="w-0 h-0 overflow-hidden cursor-pointer"
            onChange={async () => {
              if (ref?.current?.files && activeLibrary) {
                uploadImages(Array.from(ref.current.files));
              }
            }}
          />
          <label htmlFor="select-files" className="cursor-pointer">
            Upload Files
          </label>
        </button>
      </div>
    </div>
  );
}
