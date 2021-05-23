import { Library } from '../../interfaces';
import { useStorage } from '../../contexts';

type LibraryProps = {
  lib: Library;
};

export default function Tab({ lib }: LibraryProps) {
  const { activeLibrary, setActiveLibrary } = useStorage();

  return (
    <div
      role="tab"
      tabIndex={0}
      className={activeLibrary === lib.id ? 'tab tabActive' : 'tab'}
      onClick={() => setActiveLibrary(lib.id)}
      onKeyDown={() => setActiveLibrary(lib.id)}
    >
      {lib.name}
    </div>
  );
}
