import { useState, useRef, FormEvent } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import { useLayout, useLibrary } from '../../contexts';
import { createLibrary } from '../../server/service';

import Mask from '../Mask';
import Sidebar from '../Sidebar';
import Tab from './Tab';
import Profile from './Profile';

const DEFAULT_LIB_NAME = 'Untitled library';

export default function Navigation() {
  const { navigation, updateNavigation, maxNavigationWidth, isMobile } = useLayout();
  const { libraries } = useLibrary();
  const [newLibName, setNewLibName] = useState(DEFAULT_LIB_NAME);
  const [renaming, setRenaming] = useState('');
  const [error, setError] = useState('');
  const [creatingNewLib, setCreatingNewLib] = useState(false);
  const form = useRef<HTMLInputElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  const enterLibraryName = () => {
    setCreatingNewLib(true);
    if (form?.current && container?.current) {
      container.current.scrollTo(0, 0);
      form.current.focus();
      form.current.select();
    }
  };

  const newLibrary = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newLibName) {
      try {
        await createLibrary(newLibName);
        setCreatingNewLib(false);
        setNewLibName(DEFAULT_LIB_NAME);
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <>
      <Mask
        visible={navigation.visible && isMobile}
        onClick={() => updateNavigation({ visible: false })}
      />

      <Sidebar
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
          visible={!!creatingNewLib || !!renaming}
          onClick={() => {
            setCreatingNewLib(false);
            setRenaming('');
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <div className="flex-grow flex flex-col h-full pb-8 navigation-wrap">
          <div className="px-6 pt-3 pb-2 w-full max-h-12">
            <span className=" font-medium text-lg">Libraries</span>
            <span className="float-right cursor-pointer">
              <AiOutlinePlus className="inline align-middle" size={18} onClick={enterLibraryName} />
            </span>
          </div>
          <div className="w-full min-h-0 flex-grow overflow-y-scroll" ref={container}>
            <div className="px-4 flex flex-col space-y-[1px] justify-start items-start">
              <form
                className={
                  creatingNewLib
                    ? error
                      ? 'tab tab-editing tab-editing-error'
                      : 'tab tab-editing'
                    : 'tab-hidden'
                }
                onSubmit={newLibrary}
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
                <Tab key={lib.id} lib={lib} renaming={renaming} setRenaming={setRenaming} />
              ))}
            </div>
          </div>

          <Profile />
        </div>
      </Sidebar>
    </>
  );
}
