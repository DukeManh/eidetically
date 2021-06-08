import { Image } from '../../interfaces';
import { useImage } from '../../contexts';

type FigureProps = {
  image: Image;
};

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
        <img src={image.downloadURL} alt={image.name} loading="lazy" />
      </button>
      <figcaption>{image.name}</figcaption>
    </figure>
  );
}
