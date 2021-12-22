import { BiMenuAltLeft } from 'react-icons/bi';
import { ImInfo } from 'react-icons/im';

import { useLayout } from '../../../contexts';

import SearchBar from './SearchBar';
import Zoom from './Zoom';

export default function TopBar() {
  const { navigationVisible, setNavigationVisible, propertiesVisible, setPropertiesVisible } =
    useLayout();

  return (
    <div className="py-2 px-1 flex flex-row flex-wrap justify-between space-y-2 border-b border-gray-600 relative z-[11]">
      <div className="flex-grow flex flex-row justify-start items-center space-x-4 flex-shrink-0">
        <button
          className="buttonIcon p-1"
          onClick={() => {
            setNavigationVisible(!navigationVisible);
          }}
        >
          <BiMenuAltLeft size={32} className="cursor-pointer" />
        </button>
        <SearchBar />
      </div>
      <div className="flex-grow flex flex-row items-center justify-end space-x-6 flex-shrink">
        <Zoom />
        <button
          className="buttonIcon p-2"
          onClick={() => {
            setPropertiesVisible(!propertiesVisible);
          }}
        >
          <ImInfo size={22} className="cursor-pointer flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}
