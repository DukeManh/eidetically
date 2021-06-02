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
        <button
          className="w-full hover:bg-blue-500 text-left pl-4 mt-1"
          onClick={() => {
            if (ref?.current) ref.current.click();
          }}
        >
          <input
            ref={ref}
            multiple
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async () => {
              if (ref?.current?.files && activeLibrary) {
                uploadImages(Array.from(ref.current.files));
              }
            }}
          />
          Upload Files
        </button>
      </div>
    </div>
  );
}
