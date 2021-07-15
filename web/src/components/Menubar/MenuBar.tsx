import { useState } from 'react';
import { Link } from 'react-router-dom';
import Trigger from '../Trigger';

import { MenuItem } from '../../interfaces';
import { useLibrary } from '../../contexts';

import Menu from '../Menu';
import FileUploadButton from '../FileUploadButton';

export default function MenuBar() {
  const [activeItem, setActiveItem] = useState('');
  const { uploadImages } = useLibrary();
  const MenuItems: Array<{
    name: string;
    button: JSX.Element | string;
    items: MenuItem[];
  }> = [
    {
      name: 'file',
      button: 'File',
      // items: ['Open...', 'Export', 'Select all', 'Deselect all'],
      items: [
        {
          name: 'open',
          handler: () => {},
          content: <FileUploadButton onChange={uploadImages}>Upload...</FileUploadButton>,
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
    <nav className="h-9 bg-secondary relative text-gray-100 border-b border-gray-600 z-100">
      <span className="align-text-top menubar pl-2 inline-flex flex-row justify-start items-center">
        <div className="menu-item mr-2">
          <Link to="/">
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" width={18}></img>
          </Link>
        </div>
        {MenuItems.map((item) => (
          <Trigger
            popupPlacement="bottomLeft"
            onPopupVisibleChange={(i) => setActiveItem(i ? item.name : '')}
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
