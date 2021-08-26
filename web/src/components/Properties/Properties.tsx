import { useLayout, useImage } from '../../contexts';

import Mask from '../Mask';
import ImageProperties from './ImageProperties';
import ToolBox from './ToolBox';

export default function Properties() {
  const { propertiesVisible, setPropertiesVisible, DefaultSidebarWidth, isMobile } = useLayout();
  const { focused } = useImage();

  return (
    <>
      <Mask visible={propertiesVisible && isMobile} onClick={() => setPropertiesVisible(false)} />
      {propertiesVisible && (
        <div
          className="sidebar absolute right-0 overflow-y-scroll"
          style={{
            width: DefaultSidebarWidth,
          }}
        >
          <div className="mx-auto px-6 py-6 flex flex-col space-y-6 max-w-lg">
            <ToolBox />
            <div className="h-[1px] w-1/2 mx-auto bg-gray-300"></div>
            {focused && <ImageProperties />}
          </div>
        </div>
      )}
    </>
  );
}
