import React from 'react';
import { Rnd, Props as RndProps } from 'react-rnd';

interface SideBarProps extends RndProps {
  children: React.ReactNode;
  resizeSide: 'left' | 'right';
}

export default function SideBar({
  children,
  className,
  width,
  resizeSide,
  ...props
}: SideBarProps) {
  const EnableResizing = {
    top: false,
    right: resizeSide === 'right',
    bottom: false,
    left: resizeSide === 'left',
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };

  const onDragStart = () => {
    if (document) {
      const body = document.querySelector('body');
      if (body) {
        body.style.cursor = 'ew-resize';
      }
    }
  };

  const onDragStop = () => {
    if (document) {
      const body = document.querySelector('body');
      if (body) {
        body.style.cursor = 'default';
      }
    }
  };

  return (
    <Rnd
      dragAxis="x"
      className={className}
      size={{ width, height: '100%' }}
      minWidth={250}
      enableResizing={EnableResizing}
      disableDragging={true}
      bound="window"
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      {...props}
    >
      {children}
    </Rnd>
  );
}
