import { HiPlusSm, HiMinusSm, HiOutlineSearch } from 'react-icons/hi';
import { ImCancelCircle } from 'react-icons/im';
import { BiMenuAltLeft, BiMenuAltRight } from 'react-icons/bi';

import { useLayout, useLibrary } from '../../contexts';
import useQuery from '../../hooks/useQuery';

export default function TopBar() {
  const {
    navigationVisible,
    setNavigationVisible,
    propertiesVisible,
    setPropertiesVisible,
    zoom,
    setZoom,
    minZoom,
    maxZoom,
  } = useLayout();
  const { activeLibrary } = useLibrary();
  const { query, setQuery } = useQuery();

  return (
    <div className="px-1 md:px-4 flex flex-col items-center">
      <div className="h-3/4 w-full flex flex-row justify-between">
        <div className="topbarColumn justify-start space-x-4 flex-shrink-0">
          <BiMenuAltLeft
            size={28}
            className="cursor-pointer"
            onClick={() => {
              setNavigationVisible(!navigationVisible);
            }}
          />
          <div className="text-md text-truncate">{activeLibrary?.name || 'Drop it'}</div>
        </div>

        <div className="topbarColumn justify-center space-x-2 flex-shrink">
          <div className="cursor-pointer p-1 rounded-full active:bg-tabActive">
            <HiMinusSm onClick={() => setZoom(zoom - 1)} />
          </div>
          <input
            className="zoom-slider"
            type="range"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            min={minZoom}
            max={maxZoom}
            step={1}
          ></input>
          <div className="cursor-pointer p-1 rounded-full active:bg-tabActive flex-shrink-0">
            <HiPlusSm onClick={() => setZoom(zoom + 1)} />
          </div>
        </div>

        <div className="topbarColumn justify-end space-x-4 flex-shrink overflow-hidden">
          <form className="searchForm">
            <div className="searchIcon">
              <HiOutlineSearch />
            </div>
            <input
              className="searchBox"
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery('s', e.target.value)}
              value={query.get('s') || ''}
            ></input>
            {!!query.get('s') && (
              <div className="cancelIcon">
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

          <BiMenuAltRight
            size={28}
            className="cursor-pointer flex-shrink-0"
            onClick={() => {
              setPropertiesVisible(!propertiesVisible);
            }}
          />
        </div>
      </div>
    </div>
  );
}
