import { useWindowSize } from 'react-use';
import { useLayout } from '../contexts/layout';
import Mask from './Mask';
import SideBar from './Sidebar';

export default function Properties() {
  const { properties, updateProperties, maxPropertiesWidth } = useLayout();

  const { width: windowWidth } = useWindowSize();

  return (
    <>
      <Mask visible={properties.visible} onClick={() => updateProperties({ visible: false })} />
      <SideBar
        className="sidebar border-l-2 border-gray-900 pl-1"
        width={properties.width}
        maxWidth={maxPropertiesWidth()}
        position={{ x: properties.visible ? windowWidth - properties.width : windowWidth, y: 0 }}
        resizeSide="left"
        onResize={(e, dir, ref) => {
          updateProperties({ width: ref.clientWidth });
        }}
        onResizeStop={(e, dir, ref) => {
          updateProperties({ width: ref.clientWidth });
        }}
      >
        <p>Hi</p>
      </SideBar>
    </>
  );
}
