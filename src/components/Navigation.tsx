import { useLayout } from '../contexts';
import Mask from './Mask';
import SideBar from './Sidebar';

export default function Navigation() {
  const { navigation, updateNavigation, maxNavigationWidth } = useLayout();

  return (
    <>
      <Mask visible={navigation.visible} onClick={() => updateNavigation({ visible: false })} />

      <SideBar
        className="sidebar border-r-2 pr-1"
        width={navigation.width}
        maxWidth={maxNavigationWidth()}
        position={{ x: navigation.visible ? 0 : -navigation.width, y: 0 }}
        resizableSide="right"
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
