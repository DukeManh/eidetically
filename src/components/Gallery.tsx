import { useState } from 'react';
import { useDrop } from 'react-use';
import { HiMenuAlt2, HiMenuAlt3 } from 'react-icons/hi';
import { useLayout, useStorage } from '../contexts';

export default function Gallery() {
  const { activeLibrary, uploadFiles } = useStorage();
  const { navigation, updateNavigation, properties, updateProperties, isMobile } = useLayout();
  const [zoom, setZoom] = useState(isMobile ? 100 : 300);

  useDrop({
    onFiles: uploadFiles,
  });

  return (
    <div
      className="h-screen relative flex flex-col justify-start"
      id="gallery"
      style={{
        marginLeft: navigation.visible && !isMobile ? navigation.width : '0',
        marginRight: properties.visible && !isMobile ? properties.width : '0',
      }}
    >
      <div className="md:px-4 h-10 top-0 flex flex-row justify-between items-center">
        <HiMenuAlt2
          size={24}
          className="cursor-pointer"
          onClick={() => {
            updateNavigation({ visible: !navigation.visible });
          }}
        />
        <div>My workspace</div>
        <input
          className="w-36"
          type="range"
          value={zoom}
          onChange={(e) => setZoom(parseInt(e.target.value))}
          min={100}
          max={900}
          step={50}
        />
        <div>Search</div>
        <HiMenuAlt3
          size={24}
          className="cursor-pointer"
          onClick={() => {
            updateProperties({ visible: !properties.visible });
          }}
        />
      </div>
      <div className="flex-grow overflow-y-auto min-h-0">
        <div
          id="figure-container"
          style={{
            columnWidth: zoom,
          }}
        >
          {/* {activeLibrary].images.map((file) => (
            <figure key={file.preview}>
              <img src={file.preview} alt={file.name} loading="lazy" />
              <figcaption>{file.name}</figcaption>
            </figure>
          ))} */}
        </div>
      </div>
    </div>
  );
}
