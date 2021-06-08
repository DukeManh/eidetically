import { useEffect } from 'react';
import ReactDOM from 'react-dom';

type MenuProps = {
  position: {
    top?: number | string;
    left?: number | string;
  };
};

interface ContextMenuProps extends MenuProps {
  visible: boolean;
  setVisible: (val: boolean) => void;
}

function Menu(props: MenuProps) {
  return (
    <div
      ref={(r) => {
        if (r) {
          r.onclick = (e) => {
            e.stopPropagation();
          };
        }
      }}
      style={{ ...props.position }}
      className="fixed z-50 top-0 left-0 w-36 h-40 bg-dropdown"
    >
      Hello
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
      ReactDOM.render(<Menu {...props} />, document.getElementById('relative-div'));
      return;
    }
    ReactDOM.render(<></>, document.getElementById('relative-div'));
  }, [props, visible]);

  return null;
}
