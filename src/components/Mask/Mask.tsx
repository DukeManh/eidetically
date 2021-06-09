import { CSSProperties, SyntheticEvent } from 'react';

type MaskProps = {
  onClick?: (e?: SyntheticEvent) => void;
  visible: boolean;
  zIndex?: number;
  style?: CSSProperties;
};

export default function Mask({ onClick, visible, zIndex }: MaskProps) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={visible ? 'mask mask-active' : 'mask'}
        style={{ zIndex: zIndex ? zIndex : 10 }}
      ></button>
    );
  }

  return (
    <div
      className={visible ? 'mask mask-active' : 'mask'}
      style={{ zIndex: zIndex ? zIndex : 10 }}
    ></div>
  );
}
