import { useLayout, useLibrary } from '../../contexts';

// type LibraryParams = {
//   libraryID: string;
// };

export default function Images() {
  const { images, activeLibrary } = useLibrary();
  const { zoom } = useLayout();

  return (
    <div className="flex-grow overflow-y-auto min-h-0 pt-6 px-4 pb-16">
      <div
        id="figure-container"
        style={{
          columnWidth: zoom,
        }}
      >
        {activeLibrary &&
          (images[activeLibrary.id] || []).map((file) => (
            <figure key={file.id}>
              <img src={file.src} alt={file.name} loading="lazy" />
              <figcaption>{file.name}</figcaption>
            </figure>
          ))}
      </div>
    </div>
  );
}
