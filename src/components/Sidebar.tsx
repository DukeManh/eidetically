import React from 'react';
import { Rnd, Props as RndProps } from 'react-rnd';

interface SideBarProps extends RndProps {
  children: React.ReactNode;
  resizableSide: 'left' | 'right';
}

export default function SideBar({
  children,
  className,
  width,
  resizableSide,
  ...props
}: SideBarProps) {
  const EnableResizing = {
    top: false,
    right: resizableSide === 'right',
    bottom: false,
    left: resizableSide === 'left',
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };

  const onResizeStart = () => {
    if (document) {
      const body = document.querySelector('body');
      if (body) {
        body.style.cursor = 'ew-resize';

        document.addEventListener('mouseup', () => {
          body.style.cursor = 'default';
        });
      }
    }
  };

  return (
    <Rnd
      resizeAxis="x"
      className={className}
      size={{ width, height: '100%' }}
      minWidth={250}
      enableResizing={EnableResizing}
      disableDragging={true}
      bound="window"
      onResizeStart={onResizeStart}
      {...props}
    >
      {children}
    </Rnd>
  );
}
