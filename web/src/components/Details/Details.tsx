import Mask from '../Mask';
import ImageProperties from './ImageProperties';
import ToolBox from './ToolBox';

import { useLayout, useImage } from '../../contexts';

export default function Properties() {
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
            {focused && <ImageProperties image={focused} />}
          </div>
        </div>
      )}
    </>
  );
}
