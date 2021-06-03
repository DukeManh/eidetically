import { Library } from '../../interfaces';
import { useLibrary } from '../../contexts';

type LibraryProps = {
  lib: Library;
};

export default function Tab({ lib }: LibraryProps) {
  const { activeLibrary, setActiveLibrary } = useLibrary();

  return (
    <div
      role="tab"
      tabIndex={0}
      className={activeLibrary?.id === lib.id ? 'tab tabActive' : 'tab'}
      onClick={() => setActiveLibrary(lib?.id)}
      onKeyDown={() => setActiveLibrary(lib?.id)}
    >
      {lib.name}
      <span className="float-right text-gray-400">{lib.image_count}</span>
    </div>
  );
}
