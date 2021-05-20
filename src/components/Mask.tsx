import { SyntheticEvent } from 'react';
import { useLayout } from '../contexts/layout';

type MaskProps = {
  onClick?: (e?: SyntheticEvent) => void;
  visible: boolean;
};

export default function Mask({ onClick, visible }: MaskProps) {
  const { isMobile } = useLayout();

  return (
    <button
      onClick={onClick}
      className={isMobile && visible ? 'mask mask-active' : 'mask'}
    ></button>
  );
}
