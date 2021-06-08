import { useLayout, useImage } from '../../contexts';
import Figure from './Figure';

export default function Images() {
  const { activeImages } = useImage();
  const { zoom } = useLayout();

  return (
    <div className="flex-grow overflow-y-auto min-h-0 pt-6 px-4 pb-16">
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
    </div>
  );
}
