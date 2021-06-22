import { Image } from '../../interfaces';
import { useImage } from '../../contexts';
import { classNames } from '../../utilities';

export interface FigureProps {
  image: Image;
}

export default function Figure({ image }: FigureProps) {
  const { focus, selection, select, selecting, toggleSlide } = useImage();

  const handleClick = () => {
    focus(image);
    if (selecting) {
      select(image);
    }
  };

  const selected = !!selection[image.id];

  return (
    <figure key={image.id}>
      <button
        className={classNames(selected && 'border-2 border-blue-500 p-[2px]')}
        onClick={handleClick}
        onDoubleClick={toggleSlide}
      >
        <img
          className="w-full h-auto cursor-pointer shadow-sm hover:shadow-md"
          alt={image.name}
          src={image.downloadURL}
        />
      </button>
      <figcaption className="px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis text-center max-h-12 leading-6">
        {image.name}
      </figcaption>
    </figure>
  );
}
