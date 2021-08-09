import { HiPlusSm, HiMinusSm, HiOutlineSearch } from 'react-icons/hi';
import { ImCancelCircle } from 'react-icons/im';
import { BiMenuAltLeft, BiMenuAltRight } from 'react-icons/bi';

import { useLayout, useLibrary } from '../../contexts';
import useQuery from '../../hooks/useQuery';

export default function TopBar() {
  const { navigation, updateNavigation, properties, updateProperties, zoom, setZoom } = useLayout();
  const { activeLibrary } = useLibrary();
  const { query, setQuery } = useQuery();

  return (
    <div className="md:px-4 min-h-[6rem] max-h-24 h-10 top-0 space-y-2">
      <div className="h-3/4 flex flex-row justify-between">
        <div className="topbarColumn justify-start space-x-4">
          <BiMenuAltLeft
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
              <div className="absolute h-full bg-tabFocus rounded-l-md w-8 flex flex-row justify-center items-center cursor-pointer active:bg-tabActive">
                <HiOutlineSearch />
              </div>
              <input
                className="bg-textArea box-border border border-textArea focus:border-alert py-1 pr-8 pl-11 rounded-md caret-gray-400"
                type="text"
                placeholder="Search"
                onChange={(e) => setQuery('s', e.target.value)}
                value={query.get('s') || ''}
              ></input>
              {!!query.get('s') && (
                <div className="absolute right-2 top-0 h-full flex flex-row justify-center items-center cursor-pointer">
                  <ImCancelCircle
                    size={'1rem'}
                    className="hover:text-gray-300 active:text-tabActive transition-colors"
                    onClick={() => {
                      setQuery('s', '');
                    }}
                  />
                </div>
              )}
            </form>
          </div>

          <BiMenuAltRight
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
