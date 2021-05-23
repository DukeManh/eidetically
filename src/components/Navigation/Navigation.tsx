import { useLayout, useStorage } from '../../contexts';
import Mask from '../Mask';
import SideBar from '../Sidebar';
import Tab from './Tab';

export default function Navigation() {
  const { navigation, updateNavigation, maxNavigationWidth } = useLayout();
  const { storage } = useStorage();

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
        <div className="px-4 w-full h-full flex flex-col justify-start items-start">
          {Object.entries(storage).map(([id, lib]) => (
            <Tab key={id} lib={lib} />
          ))}
        </div>
      </SideBar>
    </>
  );
}
