import { useState, ReactElement, ReactNode } from 'react';
import { TriggerProps } from 'rc-trigger';
import { HiInformationCircle } from 'react-icons/hi';

import Trigger from './Trigger';
import { noop } from '../utilities';

export interface PopConfirmProps {
  children: ReactElement;
  content: ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  placement: TriggerProps['popupPlacement'];
}

export default function PopConfirm({
  children,
  content,
  cancelText,
  confirmText,
  placement,
  onCancel,
  onConfirm,
}: PopConfirmProps) {
  const [visible, setVisible] = useState(false);

  const Popup = (
    <div className="pop-confirm min-h-24 w-64 py-2 px-4 m-1 shadow-lg bg-alert text-gray-200">
      <div className="flex flex-row space-x-2 mb-2">
        <div className="h-full">
          <HiInformationCircle className="inline" />
        </div>
        <div>{content}</div>
      </div>
      <div className="text-right">
        <button
          className="px-2 py-1 mr-1 hover:bg-gray-800 hover:shadow-md rounded-sm"
          onClick={() => {
            setVisible(false);
            (onCancel || noop)();
          }}
        >
          {cancelText || 'No'}
        </button>
        <button
          className="px-2 py-1 bg-purple-600 hover:bg-purple-500 hover:shadow-md rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            (onConfirm || noop)();
          }}
        >
          {confirmText || 'Yes'}
        </button>
      </div>
    </div>
  );

  return (
    <Trigger
      popupPlacement={placement || 'top'}
      popupVisible={visible}
      onPopupVisibleChange={(i) => {
        setVisible(i);
      }}
      popup={Popup}
    >
      {children}
    </Trigger>
  );
}
