import { MdPhotoSizeSelectActual } from 'react-icons/md';

import Mask from '../Mask';
import ImageProperties from './ImageProperties';
import ToolBox from './ToolBox';

import { useLayout, useImage } from '../../contexts';

export default function Details() {
  const { propertiesVisible, setPropertiesVisible, DefaultSidebarWidth, isMobile } = useLayout();
  const { focused } = useImage();

  return (
    <>
      <Mask visible={propertiesVisible && isMobile} onClick={() => setPropertiesVisible(false)} />
      {propertiesVisible && (
        <div
          className="sidebar absolute right-0 overflow-scroll"
          style={{
            width: DefaultSidebarWidth,
          }}
        >
          <div className="mx-auto p-3 flex flex-col space-y-6 max-w-lg">
            <ToolBox />
            {focused ? (
              <ImageProperties image={focused} />
            ) : (
              <div className="select-none flex flex-col justify-center text-gray-200 items-center">
                {focused && <ImageProperties image={focused} />}
                <div className="w-1/2">
                  <MdPhotoSizeSelectActual className="text-gray-300" size={'100%'} />
                </div>
                <div>Select a photo to view details</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
