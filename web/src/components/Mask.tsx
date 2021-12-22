import { CSSProperties, SyntheticEvent, useEffect, useRef, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';

import { noop } from '../utilities';

export interface MaskProps {
  onClick?: (e?: SyntheticEvent) => void;
  visible: boolean;
  setVisible?: (val: boolean) => void;
  zIndex?: number;
  style?: CSSProperties;
}

export default function Mask({ onClick, setVisible, visible, zIndex, style }: MaskProps) {
  const mask = useRef<HTMLButtonElement>(null);

  const handle = useCallback(
    (event: Event) => {
      if ((event as KeyboardEvent).key === 'Escape') {
        (setVisible || noop)(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (visible && mask.current) {
      document.addEventListener('keydown', handle);
    }

    return () => {
      document.removeEventListener('keydown', handle);
    };
  }, [handle, setVisible, visible]);

  return (
    <CSSTransition in={visible} timeout={200} classNames="fade-transition" unmountOnExit>
      <button
        ref={mask}
        onClick={onClick ?? noop}
        className="mask"
        style={{ ...style, zIndex: zIndex || 10 }}
      ></button>
    </CSSTransition>
  );
}
