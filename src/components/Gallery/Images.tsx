import { useParams } from 'react-router-dom';
import { useLayout } from '../../contexts';

type LibraryParams = {
  libraryID: string;
};

export default function Images() {
  const { libraryID }: LibraryParams = useParams();
  const { zoom } = useLayout();

  return (
    <div className="flex-grow overflow-y-auto min-h-0 pt-6 px-4 pb-16">
      <div
        id="figure-container"
        style={{
          columnWidth: zoom,
        }}
      >
        {libraryID}
        {/* {activeLibrary].images.map((file) => (
            <figure key={file.preview}>
              <img src={file.preview} alt={file.name} loading="lazy" />
              <figcaption>{file.name}</figcaption>
            </figure>
          ))} */}
      </div>
    </div>
  );
}
