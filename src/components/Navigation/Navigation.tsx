import { useState, useRef, FormEvent, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useLayout, useLibrary } from '../../contexts';
import Mask from '../Mask';
import SideBar from '../Sidebar';
import Tab from './Tab';
import { createLibrary } from '../../server/service';

const DEFAULT_LIB_NAME = 'Untitled library';

export default function Navigation() {
  const { navigation, updateNavigation, maxNavigationWidth, isMobile } = useLayout();
  const { libraries } = useLibrary();
  const [newLibName, setNewLibName] = useState(DEFAULT_LIB_NAME);
  const [creatingNewLib, setCreatingNewLib] = useState(false);
  const form = useRef<HTMLInputElement | null>(null);

  const enterLibraryName = () => {
    setCreatingNewLib(true);
    if (form?.current) {
      form.current.select();
      form.current.focus();
    }
  };

  useEffect(() => {
    if (form?.current && creatingNewLib) {
      form.current.select();
      form.current.focus();
    }
  }, [creatingNewLib]);

  const newLibrary = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newLibName) {
      await createLibrary(newLibName);
      setCreatingNewLib(false);
      setNewLibName(DEFAULT_LIB_NAME);
    }
  };

  return (
    <>
      <Mask
        visible={navigation.visible && isMobile}
        onClick={() => updateNavigation({ visible: false })}
      />

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
        <Mask
          visible={creatingNewLib}
          onClick={() => setCreatingNewLib(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <div className="px-4 w-full h-full flex flex-col justify-start items-start">
          <div className="w-full pt-3 pb-2">
            <span className=" font-medium text-lg">Libraries</span>
            <span className="float-right cursor-pointer">
              <AiOutlinePlus className="inline align-middle" size={18} onClick={enterLibraryName} />
            </span>
          </div>
          <form
            className="tab z-50 mb-2"
            onSubmit={newLibrary}
            style={{
              display: creatingNewLib ? 'block' : 'none',
            }}
          >
            <input
              ref={form}
              value={newLibName}
              onChange={(e) => setNewLibName(e.target.value)}
              type="text"
              placeholder="Library name"
              className="text-inherit bg-inherit"
            ></input>
          </form>
          {libraries.map((lib) => (
            <Tab key={lib.id} lib={lib} />
          ))}
        </div>
      </SideBar>
    </>
  );
}
