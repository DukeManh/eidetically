import { useLayout } from '../../contexts';

import Mask from '../Mask';
import ImageProperties from './ImageProperties';
import ToolBox from './ToolBox';

export default function Properties() {
  const { propertiesVisible, setPropertiesVisible, DefaultSidebarWidth, isMobile } = useLayout();

  return (
    <>
      <Mask visible={propertiesVisible && isMobile} onClick={() => setPropertiesVisible(false)} />
      {propertiesVisible && (
        <div
          className="sidebar absolute right-0"
          style={{
            width: DefaultSidebarWidth,
          }}
        >
          <div className="mx-auto px-6 pt-6 flex flex-col space-y-6 max-w-lg">
            <ToolBox />
            <div className="h-[1px] w-1/2 mx-auto bg-gray-300"></div>
            <ImageProperties />
          </div>
        </div>
      )}
    </>
  );
}
