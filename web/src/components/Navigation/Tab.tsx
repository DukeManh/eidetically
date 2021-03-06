import { useState, useRef, FormEvent } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineShareAlt } from 'react-icons/ai';
import { HiExternalLink } from 'react-icons/hi';
import { BiRename } from 'react-icons/bi';

import { Library, MenuItem } from '../../interfaces';
import { useLibrary } from '../../contexts';
import { renameLibrary, deleteLibrary } from '../../server/service';
import { copyToClipboard, isBrowser } from '../../utilities';

import Trigger from '../Trigger';
import Menu from '../Menu';

export interface TabProps {
  lib: Library;
  renaming: string;
  setRenaming: (lidID: string) => void;
}

export default function Tab({ lib, renaming, setRenaming }: TabProps) {
  const history = useHistory();
  const { activeLibrary } = useLibrary();
  const [newLibName, setNewLibName] = useState(lib.name);
  const [error, setError] = useState('');
  const form = useRef<HTMLInputElement | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const rename = () => {
    setRenaming(lib.id);
    if (form?.current) {
      form.current.focus();
      form.current.select();
    }
  };

  const deleteLib = async () => {
    if (activeLibrary?.id === lib.id) {
      history.push('/');
    }
    toast.promise(
      new Promise<void>((resolve, reject) => {
        deleteLibrary(lib.id)
          .then(() => resolve())
          .catch((error) => reject(error));
      }),
      {
        loading: `Deleting library ${lib.name}`,
        success: 'Library deleted',
        error: (error) =>
          error instanceof Error ? error.message : "Library can't be deleted, try again",
      }
    );
  };

  const shareLib = () => {
    if (isBrowser) {
      copyToClipboard(`${window.location.origin}/${lib.id}`);
    }
    toast.success('Link copied to clipboard');
    setMenuVisible(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await renameLibrary(lib.id, newLibName);
      toast.success('Library renamed');
      setRenaming('');
      setError('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        setError(error.message);
      }
    }
  };

  const MenuItems: MenuItem[] = [
    {
      name: 'Open',
      handler: () => setMenuVisible(false),
      content: (
        <a href={`/libraries/${lib.id}`} target="_blank" rel="noreferrer">
          Open in new tab
        </a>
      ),
      icon: <HiExternalLink />,
    },
    {
      name: 'Rename',
      handler: rename,
      content: <span>Rename</span>,
      icon: <BiRename />,
    },
    {
      name: 'Delete',
      handler: () => {},
      content: <span>Delete</span>,
      icon: <AiOutlineDelete />,
      confirm: {
        content: "Action can't be reversed, all content will be deleted",
        onConfirm: deleteLib,
      },
    },
    {
      name: 'Share',
      handler: shareLib,
      content: <span>Share</span>,
      icon: <AiOutlineShareAlt />,
    },
  ];

  return (
    <>
      <form
        className={
          renaming === lib.id ? (error ? 'tab editing editing-error' : 'tab editing') : 'tab-hidden'
        }
        onSubmit={handleSubmit}
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
      {!(renaming === lib.id) && (
        <NavLink to={`/libraries/${lib.id}`} className="tab" activeClassName="tab active">
          <span className="w-3/4 h-full inline-block py-[5px] px-4 flex-grow text-truncate">
            {lib.name}
          </span>
          <span className="image-count">{lib.image_count}</span>
          <Trigger
            popupPlacement="bottomLeft"
            popupVisible={menuVisible}
            onPopupVisibleChange={(i) => setMenuVisible(i)}
            popup={<Menu items={MenuItems} />}
          >
            <button className="edit-library">
              <AiOutlineEdit />
            </button>
          </Trigger>
        </NavLink>
      )}
    </>
  );
}
