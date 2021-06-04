/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Image } from '../../interfaces';
import { useImage } from '../../contexts';

type FigureProps = {
  image: Image;
};

export default function Figure({ image }: FigureProps) {
  const { focus, selected, select, selecting } = useImage();

  const handleClick = () => {
    focus(image);
    if (selecting) {
      select(image);
    }
  };

  return (
    <figure key={image.id} className={selected[image.id] ? 'image-selected' : ''}>
      <div className="image-container">
        <img src={image.downloadURL} alt={image.name} loading="lazy" onClick={handleClick} />
      </div>
      <figcaption>{image.name}</figcaption>
    </figure>
  );
}
