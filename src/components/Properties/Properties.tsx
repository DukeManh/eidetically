import { useWindowSize } from 'react-use';
import { useLayout } from '../../contexts';
import Mask from '../Mask';
import SideBar from '../Sidebar';
import Profile from './Profile';

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
        <Profile />
      </SideBar>
    </>
  );
}
