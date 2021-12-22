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

export default function Trigger({
  children,
  onPopupVisibleChange,
  action,
  hideAction,
  popupVisible,
  ...props
}: RCTriggerProps) {
  useKey(
    'Escape',
    () => {
      if (popupVisible) {
        (onPopupVisibleChange || noop)(false);
      }
    },
    {
      target: document,
    },
    [popupVisible]
  );

  return (
    <RCTrigger
      autoDestroy
      action={action || ['click']}
      hideAction={hideAction || ['contextMenu', 'click']}
      destroyPopupOnHide
      builtinPlacements={builtinPlacements}
      getPopupContainer={() => document.querySelector('main') || document.body}
      popupClassName="absolute z-50"
      onPopupVisibleChange={onPopupVisibleChange}
      popupVisible={popupVisible}
      {...props}
    >
      {children}
    </RCTrigger>
  );
}
