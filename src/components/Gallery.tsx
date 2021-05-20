import { useState, useCallback } from 'react';
import { useDrop } from 'react-use';
import { LazyLoadImage as Img } from 'react-lazy-load-image-component';
import { Slider } from 'antd';
import { HiMenuAlt2, HiMenuAlt3 } from 'react-icons/hi';
import { useLayout } from '../contexts/layout';

interface UploadedFile extends File {
  preview: string;
}

export default function Gallery() {
  const [files, setFiles] = useState<Array<UploadedFile>>([]);
  const [zoom, setZoom] = useState(15);
  const { navigation, updateNavigation, properties, updateProperties, isMobile } = useLayout();

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        files.concat(
          acceptedFiles.reduce((images: Array<UploadedFile>, file: File) => {
            if (file.type.match(/image\/(jpe?g|png|gif|svg\+xml|webp|avif|apng)/gi)) {
              images.push(Object.assign(file, { preview: URL.createObjectURL(file) }));
            }
            return images;
          }, [])
        )
      );
    },
    [files]
  );

  useDrop({
    onFiles: onDrop,
  });

  return (
    <div
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
        <div className="w-36">
          <Slider
            value={zoom}
            onChange={(value: number) => setZoom(value)}
            tooltipVisible={false}
            min={5}
            max={100}
            step={5}
          />
        </div>
        <div>Search</div>
        <HiMenuAlt3
          size={24}
          className="cursor-pointer"
          onClick={() => {
            updateProperties({ visible: !properties.visible });
          }}
        />
      </div>
      <div
        id="figure-container"
        style={{
          columnWidth: `${zoom}rem`,
        }}
      >
        {files.map((file) => (
          <figure key={file.preview}>
            <Img src={file.preview} alt={file.name} effect="blur" />
            <figcaption>{file.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
