import { CSSProperties, useEffect } from 'react';

import { MenuItem } from '../interfaces';

import PopConfirm from './PopConfirm';

export interface ContextMenuProps {
  items: MenuItem[];
  style?: CSSProperties;
}
export interface ItemProps {
  item: MenuItem;
}

export function Item({ item }: ItemProps) {
  const { handler, name, content, icon } = item;
  return (
    <>
      <button
        className="text-left px-4 hover:bg-blue-500 items-center"
        onClick={handler}
        key={name}
      >
        <div className="flex flex-row space-x-2">
          <div className="flex-grow">{content}</div>
          <div>{icon}</div>
        </div>
      </button>
    </>
  );
}

export default function Menu({ items, style }: ContextMenuProps) {
  useEffect(() => {
    return () => {
      setTimeout(() => {
        console.log('Closed');
      }, 7000);
    };
  }, []);

  return (
    <div
      style={{ ...style }}
      className="z-50 w-min bg-dropdown shadow-sm rounded-lg pointer-events-auto"
    >
      <div className="py-2 flex flex-col space-y-1 min-w-[14rem]">
        {items.map(({ handler, name, content, icon, confirm }) =>
          confirm ? (
            <PopConfirm content={confirm.content} placement="top" onConfirm={confirm.onConfirm}>
              <div
                className="text-left px-4 hover:bg-blue-500 items-center cursor-pointer"
                key={name}
              >
                <div className="flex flex-row space-x-2">
                  <div className="flex-grow">{content}</div>
                  <div>{icon}</div>
                </div>
              </div>
            </PopConfirm>
          ) : (
            <button
              className="text-left px-4 hover:bg-blue-500 items-center"
              onClick={handler}
              key={name}
            >
              <div className="flex flex-row space-x-2">
                <div className="flex-grow">{content}</div>
                <div>{icon}</div>
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}
