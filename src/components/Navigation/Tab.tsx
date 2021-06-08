import { Link } from 'react-router-dom';
import { Library } from '../../interfaces';
import { useLibrary } from '../../contexts';

type LibraryProps = {
  lib: Library;
};

export default function Tab({ lib }: LibraryProps) {
  const { activeLibrary } = useLibrary();

  return (
    <Link className={activeLibrary?.id === lib.id ? 'tab tabActive' : 'tab'} to={`/${lib.id}`}>
      {lib.name}
      <span className="float-right text-gray-400">{lib.image_count}</span>
    </Link>
  );
}
