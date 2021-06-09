import { useState, MouseEvent, useRef, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { HiExternalLink } from 'react-icons/hi';
import { BiRename } from 'react-icons/bi';
import { AiOutlineDelete, AiOutlineShareAlt } from 'react-icons/ai';
import ContextMenu from '../ContextMenu';
import { Library } from '../../interfaces';
import { useLibrary } from '../../contexts';
import { MenuItem } from '../../interfaces';
import { renameLibrary, deleteLibrary } from '../../server/service';

type TabProps = {
  lib: Library;
  renaming: string;
  setRenaming: (lidID: string) => void;
};

export default function Tab({ lib, renaming, setRenaming }: TabProps) {
  const history = useHistory();
  const { activeLibrary } = useLibrary();
  const [menu, toggleMenu] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [newLibName, setNewLibName] = useState(lib.name);
  const [error, setError] = useState('');
  const form = useRef<HTMLInputElement | null>(null);
  const openMenu = (e: MouseEvent) => {
    e.preventDefault();
    setPosition({ left: e.clientX, top: e.clientY });
    toggleMenu(!menu);
  };

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
    await deleteLibrary(lib.id);
  };

  const shareLib = () => {
    if (window) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await renameLibrary(lib.id, newLibName);
      setRenaming('');
      setError('');
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const MenuItems: MenuItem[] = [
    {
      name: 'Open',
      handler: () => {},
      content: (
        <a href={`/${lib.id}`} target="_blank" rel="noreferrer">
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
      handler: deleteLib,
      content: <span>Delete</span>,
      icon: <AiOutlineDelete />,
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
          renaming === lib.id
            ? error
              ? 'tab tab-editing tab-editing-error'
              : 'tab tab-editing'
            : 'tab-hidden'
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
        <>
          <ContextMenu
            items={MenuItems}
            visible={menu}
            setVisible={toggleMenu}
            position={position}
          />
          <div
            className={activeLibrary?.id === lib.id ? 'tab tab-active' : 'tab'}
            onContextMenu={openMenu}
          >
            <Link to={`/${lib.id}`} className="w-3/4 h-full inline-block py-1 px-3 flex-grow">
              {lib.name}
            </Link>
            <span className="image-count">{lib.image_count}</span>
            <button className="edit-library" onClick={openMenu}>
              <AiOutlineEdit />
            </button>
          </div>
        </>
      )}
    </>
  );
}
