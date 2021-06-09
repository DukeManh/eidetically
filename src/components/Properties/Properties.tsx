import { useWindowSize } from 'react-use';
import { useLayout } from '../../contexts';
import Mask from '../Mask';
import SideBar from '../Sidebar';
import ImageProperties from './ImageProperties';
import ToolBox from './ToolBox';

export default function Properties() {
  const { properties, updateProperties, maxPropertiesWidth, isMobile } = useLayout();
  const { width: windowWidth } = useWindowSize();

  return (
    <>
      <Mask
        visible={properties.visible && isMobile}
        onClick={() => updateProperties({ visible: false })}
      />
      <SideBar
        className="sidebar border-l-2 pl-1"
        width={properties.width}
        maxWidth={maxPropertiesWidth()}
        position={{ x: properties.visible ? windowWidth - properties.width : windowWidth, y: 0 }}
        resizableSide="left"
        onResize={(e, dir, ref) => {
          updateProperties({ width: ref.clientWidth });
        }}
        onResizeStop={(e, dir, ref) => {
          updateProperties({ width: ref.clientWidth });
        }}
      >
        <div className="mx-auto px-6 pt-6 flex flex-col gap-y-6 max-w-lg">
          <ToolBox />
          <div className="h-[1px] w-1/2 mx-auto bg-gray-300"></div>
          <ImageProperties />
        </div>
      </SideBar>
    </>
  );
}
