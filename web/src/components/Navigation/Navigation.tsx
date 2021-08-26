import { useState, useRef, FormEvent } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { useWindowSize } from 'react-use';

import { useLayout, useLibrary } from '../../contexts';
import { createLibrary } from '../../server/service';

import Mask from '../Mask';
import Sidebar from '../Sidebar';
import Tab from './Tab';
import Profile from './Profile';

const DEFAULT_LIB_NAME = 'Untitled library';

export default function Navigation() {
  const {
    navigationWidth,
    DefaultSidebarWidth,
    navigationVisible,
    setNavigationVisible,
    setNavigationWidth,
    isMobile,
  } = useLayout();
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
      toast.promise(
        new Promise<void>((resolve, reject) => {
          createLibrary(newLibName.trim())
            .then(() => {
              setCreatingNewLib(false);
              setNewLibName(DEFAULT_LIB_NAME);
              setError('');
              resolve();
            })
            .catch((error) => {
              setError(error);
              reject(error);
            });
        }),
        {
          loading: `Creating ${newLibName}`,
          success: 'Library created',
          error: (error) => error.message,
        }
      );
    }
  };

  const { width } = useWindowSize();

  return (
    <>
      <Mask visible={navigationVisible && isMobile} onClick={() => setNavigationVisible(false)} />

      {navigationVisible && (
        <Sidebar
          className="sidebar shadow-sm z-50"
          width={navigationWidth}
          resizableSide="right"
          onResize={(e, dir, ref) => {
            setNavigationWidth(
              isMobile
                ? Math.min(ref.clientWidth, width - 10)
                : Math.min(ref.clientWidth, width - DefaultSidebarWidth * 3)
            );
          }}
          onResizeStop={(e, dir, ref) => {
            setNavigationWidth(
              isMobile
                ? Math.min(ref.clientWidth, width - 10)
                : Math.min(ref.clientWidth, width - DefaultSidebarWidth * 3)
            );
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
                <AiOutlinePlus
                  className="inline align-middle"
                  size={18}
                  onClick={enterLibraryName}
                />
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
      )}
    </>
  );
}
