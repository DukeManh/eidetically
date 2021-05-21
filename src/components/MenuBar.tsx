import { BsDropletHalf } from 'react-icons/bs';

export default function MenuBar() {
  return (
    <nav className="h-8 bg-secondary text-gray-100 border-b border-gray-500 z-100">
      <ul className="menubar pl-2 flex flex-row justify-start align-middle gap-x-4">
        <li>
          <BsDropletHalf className="h-full" />
        </li>
        <li>File</li>
        <li>Layout</li>
        <li>About</li>
      </ul>
    </nav>
  );
}
