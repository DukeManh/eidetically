import { Image } from '../../interfaces';
import { useImage } from '../../contexts';

export interface FigureProps {
  image: Image;
}

export default function Figure({ image }: FigureProps) {
  const { focus, selected, select, selecting, toggleSlide } = useImage();

  const handleClick = () => {
    focus(image);
    if (selecting) {
      select(image);
    }
  };

  return (
    <figure key={image.id} className={selected[image.id] ? 'image-selected' : ''}>
      <button className="image-container" onClick={handleClick} onDoubleClick={toggleSlide}>
        <img alt={image.name} src={image.downloadURL} />
      </button>
      <figcaption>{image.name}</figcaption>
    </figure>
  );
}
