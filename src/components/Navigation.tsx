import { useLayout } from '../contexts/layout';
import Mask from './Mask';
import SideBar from './Sidebar';

export default function Navigation() {
  const { navigation, updateNavigation, maxNavigationWidth } = useLayout();

  return (
    <>
      <Mask visible={navigation.visible} onClick={() => updateNavigation({ visible: false })} />

      <SideBar
        className="sidebar border-r-2 border-gray-900 pr-1 h-full"
        width={navigation.width}
        maxWidth={maxNavigationWidth()}
        position={{ x: navigation.visible ? 0 : -navigation.width, y: 0 }}
        resizeSide="right"
        onResize={(e, dir, ref) => {
          updateNavigation({ width: ref.clientWidth });
        }}
        onResizeStop={(e, dir, ref) => {
          updateNavigation({ width: ref.clientWidth });
        }}
      >
        <p>Hello</p>
      </SideBar>
    </>
  );
}
