import RCTrigger, { TriggerProps as RCTriggerProps } from 'rc-trigger';
import { useKey } from 'react-use';

import { noop } from '../utilities';

const builtinPlacements = {
  left: {
    points: ['cr', 'cl'],
  },
  right: {
    points: ['cl', 'cr'],
  },
  top: {
    points: ['bc', 'tc'],
  },
  bottom: {
    points: ['tc', 'bc'],
  },
  topLeft: {
    points: ['bl', 'tl'],
  },
  topRight: {
    points: ['br', 'tr'],
  },
  bottomRight: {
    points: ['tr', 'br'],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
  },
};

export default function Trigger({ children, onPopupVisibleChange, ...props }: RCTriggerProps) {
  useKey('Escape', () => (onPopupVisibleChange || noop)(false));

  return (
    <RCTrigger
      action={['click']}
      autoDestroy
      hideAction={['contextMenu', 'click']}
      destroyPopupOnHide
      builtinPlacements={builtinPlacements}
      getPopupContainer={() => document.querySelector('main') || document.body}
      popupClassName="absolute z-50"
      onPopupVisibleChange={onPopupVisibleChange}
      {...props}
    >
      {children}
    </RCTrigger>
  );
}
