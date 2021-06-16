import { HiMenuAlt2, HiMenuAlt3 } from 'react-icons/hi';

import { useLayout, useLibrary } from '../../contexts';

export default function TopBar() {
  const { navigation, updateNavigation, properties, updateProperties, zoom, setZoom } = useLayout();
  const { activeLibrary } = useLibrary();

  return (
    <div className="md:px-4 min-h-[6rem] max-h-24 h-10 top-0 space-y-2">
      <div className="h-1/2 flex flex-row justify-between items-center">
        <HiMenuAlt2
          size={28}
          className="cursor-pointer"
          onClick={() => {
            updateNavigation({ visible: !navigation.visible });
          }}
        />

        <div className="text-md">{activeLibrary?.name || 'Drop it'}</div>

        <div className="max-w-xs">
          <input
            className="zoom-slider"
            type="range"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            min={100}
            max={900}
            step={50}
          ></input>
        </div>

        <div>Search</div>

        <HiMenuAlt3
          size={28}
          className="cursor-pointer"
          onClick={() => {
            updateProperties({ visible: !properties.visible });
          }}
        />
      </div>
    </div>
  );
}
