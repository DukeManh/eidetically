import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useKey } from 'react-use';
import { BsDropletHalf } from 'react-icons/bs';
import Trigger from 'rc-trigger';

import { MenuItem } from '../../interfaces';
import { useLibrary } from '../../contexts';

import Menu from '../Menu';
import FileUploadButton from './FileUploadButton';

export default function MenuBar() {
  const [activeItem, setActiveItem] = useState('');
  const { uploadImages } = useLibrary();
  useKey('Escape', () => setActiveItem(''));
  const MenuItems: Array<{
    name: string;
    button: JSX.Element | string;
    items: MenuItem[];
  }> = [
    {
      name: 'logo',
      button: (
        <Link to="/">
          <BsDropletHalf />
        </Link>
      ),
      items: [],
    },
    {
      name: 'file',
      button: 'File',
      // items: ['Open...', 'Export', 'Select all', 'Deselect all'],
      items: [
        {
          name: 'open',
          handler: () => {},
          content: <FileUploadButton onChange={uploadImages} />,
        },
      ],
    },
    {
      name: 'layout',
      button: 'Layout',
      items: [],
    },
    {
      name: 'about',
      button: 'About',
      items: [],
    },
  ];

  return (
    <nav className="h-9 bg-secondary relative text-gray-100 border-b border-gray-500 z-100">
      <span className="align-text-top menubar pl-2 inline-flex flex-row justify-start items-center">
        {MenuItems.map((item) => (
          <Trigger
            popupPlacement="bottomLeft"
            action={['click']}
            autoDestroy
            hideAction={['contextMenu', 'click']}
            destroyPopupOnHide
            onPopupVisibleChange={(i) => setActiveItem(i ? item.name : '')}
            builtinPlacements={{
              bottomLeft: {
                points: ['tl', 'bl'],
              },
            }}
            getPopupContainer={() => document.querySelector('main') || document.body}
            popupClassName="absolute z-50"
            popupVisible={activeItem === item.name}
            popup={
              <Menu
                style={{
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
                items={item.items}
              />
            }
            key={item.name}
          >
            <div className="menu-item">
              <button onClick={() => setActiveItem(item.name)}>{item.button}</button>
            </div>
          </Trigger>
        ))}
      </span>
    </nav>
  );
}
