import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLayout, useImage, useLibrary } from '../../contexts';
import { RouterParams } from '../../interfaces';
import Figure from './Figure';

export default function Images() {
  const { setActiveLibrary } = useLibrary();
  const { activeImages } = useImage();
  const { zoom } = useLayout();
  const { libParam } = useParams<RouterParams>();

  useEffect(() => {
    setActiveLibrary(libParam);
  }, [libParam, setActiveLibrary]);

  return (
    <div
      id="figure-container"
      style={{
        columnWidth: zoom,
      }}
    >
      {Object.values(activeImages).map((image) => (
        <Figure key={image.id} image={image} />
      ))}
    </div>
  );
}
