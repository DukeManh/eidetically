import { CSSProperties } from 'react';

import { MenuItem } from '../interfaces';

export type ContextMenuProps = {
  items: MenuItem[];
  style?: CSSProperties;
};

export default function Menu({ items, style }: ContextMenuProps) {
  return (
    <div style={{ ...style }} className="z-50 w-min bg-dropdown rounded-lg pointer-events-auto">
      <div className="py-2 flex flex-col space-y-1 min-w-[14rem]">
        {items.map(({ handler, name, content, icon }) => (
          <button
            className="text-left px-4 hover:bg-blue-500 flex flew-row items-center"
            onClick={handler}
            key={name}
          >
            <div className="flex-grow">{content}</div>
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
