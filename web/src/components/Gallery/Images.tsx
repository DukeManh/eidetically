import { Image } from '../../interfaces';
import { useLayout } from '../../contexts';

import Figure from './Figure';

export interface ImagesProps {
  images: Image[];
}

export default function Images({ images }: ImagesProps) {
  const { zoom, maxZoom } = useLayout();

  const columns = maxZoom - zoom + 1;
  return (
    <div
      className="waterfall"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: columns }, (_, i) => i).map((column) => (
        <div key={`${zoom}:${column}`} className="imageColumn">
          {images
            .filter((_, i) => i % columns == column)
            .map((image) => (
              <Figure key={image.id} image={image} />
            ))}
        </div>
      ))}
    </div>
  );
}
