import { useState, useEffect } from 'react';
import { BsDropletHalf } from 'react-icons/bs';
import MenuBarDropdown from './MenuBarDropdown';

const MenuItems = [
  {
    name: 'logo',
    button: <BsDropletHalf />,
    options: [],
  },
  {
    name: 'file',
    button: 'File',
    options: ['Open...', 'Export', 'Select all', 'Deselect all'],
  },
  {
    name: 'layout',
    button: 'Layout',
    options: [],
  },
  {
    name: 'about',
    button: 'About',
    options: [],
  },
];

export default function MenuBar() {
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    if (document) {
      const main = document.querySelector('main');
      if (main) {
        main.onclick = () => {
          setActiveItem('');
        };
      }
    }
  }, []);

  return (
    <nav className="h-9 bg-secondary relative text-gray-100 border-b border-gray-500 z-100">
      <span className="align-text-top menubar pl-2 inline-flex flex-row justify-start items-center">
        {MenuItems.map((item) => (
          <div key={item.name}>
            <button onClick={() => setActiveItem(item.name)}>{item.button}</button>
            {item?.options.length > 0 && activeItem === item.name && (
              <MenuBarDropdown options={item.options} />
            )}
          </div>
        ))}
      </span>
    </nav>
  );
}
