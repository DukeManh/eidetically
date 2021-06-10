import { useEffect, Dispatch, SetStateAction } from 'react';
import ReactDOM from 'react-dom';
import { MenuItem } from '../../interfaces';

type MenuProps = {
  position: {
    top?: number | string;
    left?: number | string;
  };
  items: MenuItem[];
};

interface ContextMenuProps extends MenuProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

function Menu({ position, items }: MenuProps) {
  return (
    <div
      style={{ ...position }}
      className="fixed z-50 top-0 left-0 min-w-[14rem] bg-dropdown rounded-md"
    >
      <div className="w-full h-full py-2 flex flex-col space-y-1">
        {items.map(({ handler, name, content, icon }) => (
          <button
            className="text-left px-4 hover:bg-blue-500 flex flew-row items-center"
            onClick={() => {
              handler();
            }}
            key={name}
          >
            <div className="flex-grow">{content}</div>
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ContextMenu({ visible, setVisible, ...props }: ContextMenuProps) {
  useEffect(() => {
    if (visible) {
      document.onclick = () => {
        setVisible(false);
      };
      return;
    }
    document.onclick = null;
  }, [setVisible, visible]);

  useEffect(() => {
    if (visible) {
      ReactDOM.render(<Menu {...props} />, document.getElementById('contextmenu-container'));
      return;
    }
    ReactDOM.render(<></>, document.getElementById('contextmenu-container'));
  }, [props, visible]);

  return null;
}
