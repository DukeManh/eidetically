import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiCheck } from 'react-icons/bi';

import Trigger from '../Trigger';
import { MenuItem } from '../../interfaces';
import { useLayout } from '../../contexts';

import Menu from '../Menu';
import FileUploadButton from '../FileUploadButton';

export default function MenuBar() {
  const [activeItem, setActiveItem] = useState('');
  const { setLayout, layout } = useLayout();
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
          content: <FileUploadButton>Upload...</FileUploadButton>,
        },
      ],
    },
    {
      name: 'layout',
      button: 'Layout',
      items: [
        {
          name: 'Waterfall',
          handler: () => setLayout('Waterfall'),
          icon: layout === 'Waterfall' ? <BiCheck /> : <></>,
          content: 'Waterfall',
        },
        {
          name: 'Justified',
          handler: () => setLayout('Justified'),
          icon: layout === 'Justified' ? <BiCheck /> : <></>,
          content: 'Justified',
        },
      ],
    },
    {
      name: 'about',
      button: 'About',
      items: [],
    },
  ];

  return (
    <nav className="h-9 bg-secondary relative text-gray-100 border-b border-gray-600 z-50">
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
            popup={<Menu items={item.items} className="rounded-t-none" />}
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
