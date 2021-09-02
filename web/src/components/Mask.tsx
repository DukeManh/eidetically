import { CSSProperties, SyntheticEvent } from 'react';
import { CSSTransition } from 'react-transition-group';

import { noop } from '../utilities';

export interface MaskProps {
  onClick?: (e?: SyntheticEvent) => void;
  visible: boolean;
  zIndex?: number;
  style?: CSSProperties;
}

export default function Mask({ onClick, visible, zIndex, style }: MaskProps) {
  return (
    <CSSTransition in={visible} timeout={200} classNames="fade-transition" unmountOnExit>
      <button
        onClick={onClick ?? noop}
        className="mask"
        style={{ ...style, zIndex: zIndex ? zIndex : 10 }}
      ></button>
    </CSSTransition>
  );
}
