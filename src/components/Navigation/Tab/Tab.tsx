import { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Library } from '../../../interfaces';
import { useLibrary } from '../../../contexts';
import { AiOutlineEdit } from 'react-icons/ai';
import ContextMenu from './ContextMenu';

type LibraryProps = {
  lib: Library;
};

export default function Tab({ lib }: LibraryProps) {
  const { activeLibrary } = useLibrary();
  const [menu, toggleMenu] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const openMenu = (e: MouseEvent) => {
    e.preventDefault();
    setPosition({ left: e.clientX, top: e.clientY });
    toggleMenu(!menu);
  };

  return (
    <>
      <ContextMenu visible={menu} setVisible={toggleMenu} position={position} />
      <div
        className={activeLibrary?.id === lib.id ? 'tab tabActive' : 'tab'}
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
  );
}
