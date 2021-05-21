import { BsDropletHalf } from 'react-icons/bs';

export default function MenuBar() {
  return (
    <nav className="h-9 bg-secondary text-gray-100 border-b border-gray-500 z-100">
      <span className="align-text-top menubar pl-2 inline-flex flex-row justify-start items-center">
        <button>
          <BsDropletHalf />
        </button>
        <button>File</button>
        <button>Layout</button>
        <button>About</button>
      </span>
    </nav>
  );
}
