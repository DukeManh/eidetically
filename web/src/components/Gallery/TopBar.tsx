import { HiMenuAlt2, HiMenuAlt3, HiPlusSm, HiMinusSm, HiOutlineSearch } from 'react-icons/hi';

import { useLayout, useLibrary } from '../../contexts';

export default function TopBar() {
  const { navigation, updateNavigation, properties, updateProperties, zoom, setZoom } = useLayout();
  const { activeLibrary } = useLibrary();

  return (
    <div className="md:px-4 min-h-[6rem] max-h-24 h-10 top-0 space-y-2">
      <div className="h-3/4 flex flex-row justify-between">
        <div className="topbarColumn justify-start space-x-4">
          <HiMenuAlt2
            size={28}
            className="cursor-pointer"
            onClick={() => {
              updateNavigation({ visible: !navigation.visible });
            }}
          />
          <div className="text-md text-truncate">{activeLibrary?.name || 'Drop it'}</div>
        </div>

        <div className="topbarColumn justify-center space-x-2">
          <div className="cursor-pointer p-1 rounded-full active:bg-tabActive">
            <HiMinusSm onClick={() => setZoom(zoom - 100)} />
          </div>
          <input
            className="zoom-slider"
            type="range"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            min={100}
            max={900}
            step={50}
          ></input>
          <div className="cursor-pointer p-1 rounded-full active:bg-tabActive">
            <HiPlusSm onClick={() => setZoom(zoom + 100)} />
          </div>
        </div>

        <div className="topbarColumn justify-end space-x-4">
          <div>
            <form className="relative">
              <div className="absolute h-full bg-tabFocus transform rounded-l-md w-8 flex flex-row justify-center items-center cursor-pointer active:bg-tabActive">
                <HiOutlineSearch />
              </div>
              <input
                className="bg-textArea box-border focus:border border-alert py-2 pr-3 pl-11 rounded-md caret-gray-400"
                type="text"
                placeholder="Search"
              ></input>
            </form>
          </div>

          <HiMenuAlt3
            size={28}
            className="cursor-pointer"
            onClick={() => {
              updateProperties({ visible: !properties.visible });
            }}
          />
        </div>
      </div>
    </div>
  );
}
