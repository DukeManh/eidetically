import { CSSProperties } from 'react';

import { MenuItem } from '../interfaces';
import { classNames } from '../utilities';

import PopConfirm from './PopConfirm';

export interface ContextMenuProps {
  items: MenuItem[];
  style?: CSSProperties;
  className?: string;
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

export default function Menu({ items, style, className }: ContextMenuProps) {
  const classnames = classNames(
    className,
    'z-50 w-min bg-dropdown shadow-sm rounded-lg pointer-events-auto'
  );

  return (
    <div style={{ ...style }} className={classnames}>
      <div className="py-2 flex flex-col space-y-1 min-w-[14rem] max-w-[16rem]">
        {items.map(({ handler, name, content, icon, confirm }) =>
          confirm ? (
            <PopConfirm
              content={confirm.content}
              placement="top"
              onConfirm={confirm.onConfirm}
              key={name}
            >
              <div className="text-left px-4 hover:bg-blue-500 items-center cursor-pointer">
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
