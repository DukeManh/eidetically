/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Image } from '../../interfaces';
import { useImage } from '../../contexts';

type FigureProps = {
  image: Image;
};

export default function Figure({ image }: FigureProps) {
  const { focus } = useImage();

  return (
    <figure key={image.id}>
      <img src={image.downloadURL} alt={image.name} loading="lazy" onClick={() => focus(image)} />
      <figcaption>{image.name}</figcaption>
    </figure>
  );
}
