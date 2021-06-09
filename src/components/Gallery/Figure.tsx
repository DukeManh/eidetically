import { useEffect, useRef } from 'react';
import { Image } from '../../interfaces';
import { useImage } from '../../contexts';
import placeholder from '../../public/images/placeholder.jpg';

type FigureProps = {
  image: Image;
};

export default function Figure({ image }: FigureProps) {
  const { focus, selected, select, selecting, toggleSlide } = useImage();
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef?.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const { isIntersecting } = entry;
            if (isIntersecting && imageRef?.current) {
              console.log(imageRef.current.src);
              imageRef.current.src = image.downloadURL;
              observer.unobserve(imageRef.current);
            }
          });
        },
        {
          root: document.querySelector('main'),
          rootMargin: '0px 0px 200px 0px',
        }
      );

      observer.observe(imageRef.current);
    }
  }, [image.downloadURL]);

  const handleClick = () => {
    focus(image);
    if (selecting) {
      select(image);
    }
  };

  return (
    <figure key={image.id} className={selected[image.id] ? 'image-selected' : ''}>
      <button className="image-container" onClick={handleClick} onDoubleClick={toggleSlide}>
        <img alt={image.name} ref={imageRef} src={placeholder} />
      </button>
      <figcaption>{image.name}</figcaption>
    </figure>
  );
}
