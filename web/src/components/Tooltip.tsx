import { useState, ReactElement } from 'react';
import { TriggerProps } from 'rc-trigger';

import Trigger from './Trigger';

export interface TooltipProps {
  children: ReactElement;
  placement?: TriggerProps['popupPlacement'];
  text: string;
}

export default function Tooltip({ children, placement, text }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Trigger
      popupPlacement={placement || 'top'}
      popupVisible={visible}
      onPopupVisibleChange={(i) => {
        setVisible(i);
      }}
      mouseEnterDelay={1}
      popup={
        <div className="bg-alert shadow-sm text-xs rounded py-1 px-4 relative left-2">{text}</div>
      }
      action={['hover']}
    >
      {children}
    </Trigger>
  );
}
