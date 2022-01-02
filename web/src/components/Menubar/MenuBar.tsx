import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { BiCheck, BiMailSend } from 'react-icons/bi';

import Trigger from '../Trigger';
import { MenuItem } from '../../interfaces';
import { useLayout } from '../../contexts';

import Menu from '../Menu';
import FileUploadButton from '../FileUploadButton';

import { noop } from '../../utilities';

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
          name: 'waterfall',
          handler: () => setLayout('Waterfall'),
          icon: layout === 'Waterfall' ? <BiCheck /> : <></>,
          content: 'Waterfall',
        },
        {
          name: 'justified',
          handler: () => setLayout('Justified'),
          icon: layout === 'Justified' ? <BiCheck /> : <></>,
          content: 'Justified',
        },
      ],
    },
    {
      name: 'about',
      button: 'About',
      items: [
        {
          name: 'version',
          handler: noop,
          icon: <span className="text-gray-300">1.0.0</span>,
          content: 'Version',
        },
        {
          name: 'contact',
          handler: noop,
          icon: <BiMailSend />,
          content: (
            <a href="mailto:mysecondhandemail@gmail.com" className="block w-full">
              Contact
            </a>
          ),
        },
      ],
    },
  ];

  const onMouseOver = useCallback(
    (item: string) => {
      if (activeItem && activeItem !== item) {
        setActiveItem(item);
      }
    },
    [activeItem]
  );

  return (
    <nav className="h-9 p-1 bg-secondary relative text-gray-100 border-b border-gray-600 z-50 flex flex-row items-center">
      <div className="menubar pl-2 flex flex-row justify-start items-center">
        <NavLink to="/">
          <div className="menu-item px-4 pxy-2">
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" width={20}></img>
          </div>
        </NavLink>
        {MenuItems.map((item) => (
          <Trigger
            popupPlacement="bottomLeft"
            onPopupVisibleChange={(i) => setActiveItem(i ? item.name : '')}
            popupVisible={activeItem === item.name}
            popup={<Menu items={item.items} className="rounded-t-none" />}
            key={item.name}
          >
            <div className={activeItem === item.name ? 'menu-item active' : 'menu-item'}>
              <button
                onClick={() => setActiveItem(item.name)}
                onMouseEnter={() => onMouseOver(item.name)}
              >
                {item.button}
              </button>
            </div>
          </Trigger>
        ))}
      </div>
    </nav>
  );
}
