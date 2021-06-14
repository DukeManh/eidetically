import { useState, useRef, FormEvent } from 'react';
import { useKey } from 'react-use';
import { Link, useHistory } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { HiExternalLink } from 'react-icons/hi';
import { BiRename } from 'react-icons/bi';
import { AiOutlineDelete, AiOutlineShareAlt } from 'react-icons/ai';
import Trigger from 'rc-trigger';

import Menu from '../Menu';
import { Library, MenuItem } from '../../interfaces';
import { useLibrary } from '../../contexts';
import { renameLibrary, deleteLibrary } from '../../server/service';

type TabProps = {
  lib: Library;
  renaming: string;
  setRenaming: (lidID: string) => void;
};

export default function Tab({ lib, renaming, setRenaming }: TabProps) {
  const history = useHistory();
  const { activeLibrary } = useLibrary();
  const [newLibName, setNewLibName] = useState(lib.name);
  const [error, setError] = useState('');
  const form = useRef<HTMLInputElement | null>(null);
  const [vi, setVi] = useState(false);

  useKey('Escape', () => setVi(false));
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
      handler: () => setVi(false),
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
        <div className={activeLibrary?.id === lib.id ? 'tab tab-active' : 'tab'}>
          <Link to={`/${lib.id}`} className="w-3/4 h-full inline-block py-1 px-3 flex-grow">
            {lib.name}
          </Link>
          <span className="image-count">{lib.image_count}</span>
          <Trigger
            popupPlacement="bottomLeft"
            action={['click']}
            autoDestroy
            hideAction={['contextMenu', 'click']}
            destroyPopupOnHide
            onPopupVisibleChange={(i) => setVi(i)}
            builtinPlacements={{
              bottomLeft: {
                points: ['tl', 'bl'],
              },
            }}
            getPopupContainer={() => document.querySelector('main') || document.body}
            popupClassName="absolute z-50"
            popupVisible={vi}
            popup={<Menu items={MenuItems} />}
          >
            <button className="edit-library">
              <AiOutlineEdit />
            </button>
          </Trigger>
        </div>
      )}
    </>
  );
}
