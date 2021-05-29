import { AiOutlinePlus } from 'react-icons/ai';
import { useLayout, useLibrary } from '../../contexts';
import Mask from '../Mask';
import SideBar from '../Sidebar';
import Tab from './Tab';
import { createLibrary } from '../../server/service';

export default function Navigation() {
  const { navigation, updateNavigation, maxNavigationWidth } = useLayout();
  const { libraries } = useLibrary();

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
        <div className="px-6 w-full h-full flex flex-col justify-start items-start">
          <div className="w-full">
            <span>Libraries</span>
            <span className="float-right cursor-pointer">
              <AiOutlinePlus
                className="inline align-middle"
                onClick={() => createLibrary('random')}
              />
            </span>
          </div>
          {libraries.map((lib) => (
            <Tab key={lib.id} lib={lib} />
          ))}
        </div>
      </SideBar>
    </>
  );
}
