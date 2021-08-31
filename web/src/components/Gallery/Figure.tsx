import { Image } from '../../interfaces';
import { useImage, useLayout } from '../../contexts';
import { classNames } from '../../utilities';

export interface FigureProps {
  image: Image;
}

export default function Figure({ image }: FigureProps) {
  const { focus, selection, select, selecting, toggleSlide } = useImage();
  const { layout, zoom } = useLayout();

  const handleClick = () => {
    focus(image);
    if (selecting) {
      select(image);
    }
  };

  const selected = !!selection[image.id];

  return (
    <figure className="pb-8 relative">
      <button
        onClick={handleClick}
        onDoubleClick={() => toggleSlide()}
        style={{ width: '100%', display: 'block' }}
      >
        <img
          style={
            layout === 'Justified'
              ? {
                  height: `${5 * zoom}vw`,
                }
              : undefined
          }
          className={classNames(
            selected && 'border-2 border-blue-500 p-[2px]',
            'cursor-pointer shadow-sm hover:shadow-md'
          )}
          alt={image.name}
          src={image.downloadURL}
          loading="lazy"
        />
      </button>
      <figcaption className="absolute bottom-1 max-w-[90%] left-1/2 -translate-x-1/2 pt-1 px-4 text-truncate text-sm text-center leading-6">
        {image.name}
      </figcaption>
    </figure>
  );
}
