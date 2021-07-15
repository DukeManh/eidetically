import { CSSProperties, SyntheticEvent } from 'react';

export interface MaskProps {
  onClick?: (e?: SyntheticEvent) => void;
  visible: boolean;
  zIndex?: number;
  style?: CSSProperties;
}

export default function Mask({ onClick, visible, zIndex, style }: MaskProps) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={visible ? 'mask mask-active' : 'mask'}
        style={{ ...style, zIndex: zIndex ? zIndex : 10 }}
      ></button>
    );
  }

  return (
    <div
      className={visible ? 'mask mask-active' : 'mask'}
      style={{ ...style, zIndex: zIndex ? zIndex : 10 }}
    ></div>
  );
}
