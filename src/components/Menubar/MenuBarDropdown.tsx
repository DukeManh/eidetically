import { useImage } from '../../contexts';

export default function MenuBarDropdown({ options }: { options: Array<string> }) {
  const { selectFiles } = useImage();
  return (
    <div
      className="menu-dropdown absolute z-50 bg-tertiary rounded-b-lg w-56 text-white min-h"
      style={{ top: 'calc(100% + 1px)' }}
    >
      <div className="flex flex-col py-2">
        {options.map((option) => (
          <button key={option} className="w-full hover:bg-blue-500 text-left pl-4 mt-1">
            {option}
          </button>
        ))}
        <button onClick={selectFiles} className="w-full hover:bg-blue-500 text-left pl-4 mt-1">
          UploadFile
        </button>
      </div>
    </div>
  );
}
