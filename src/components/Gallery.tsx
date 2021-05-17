import { useState, useCallback } from 'react';
import { LazyLoadImage as Img } from 'react-lazy-load-image-component';
import { useDropzone } from 'react-dropzone';
import { Slider } from 'antd';
import { HiMenuAlt2, HiMenuAlt3 } from 'react-icons/hi';
import { useLayout } from '../contexts/layout';

interface UploadedFile extends File {
  preview: string;
}

export default function Gallery() {
  const [files, setFiles] = useState<Array<UploadedFile>>([]);
  const [zoom, setZoom] = useState(15);
  const { navigationVisible, toggleNavigation, propertiesVisible, toggleProperties, isMobile } =
    useLayout();

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        files.concat(
          acceptedFiles.map((file: File) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        )
      );
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div
      id="gallery"
      style={{
        marginLeft: navigationVisible && !isMobile ? '250px' : '0',
        marginRight: propertiesVisible && !isMobile ? '250px' : '0',
      }}
    >
      <div className="md:px-4 h-10 top-0 flex flex-row justify-between items-center">
        <HiMenuAlt2
          size={'1.7rem'}
          className="cursor-pointer"
          onClick={() => {
            if (isMobile) toggleProperties(false);
            toggleNavigation();
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
          size={'1.7rem'}
          className="cursor-pointer"
          onClick={() => {
            if (isMobile) toggleNavigation(false);
            toggleProperties();
          }}
        />
      </div>
      <div
        id="figure-container"
        style={{
          columnWidth: `${zoom}rem`,
        }}
      >
        <div {...getRootProps()} className={isDragActive ? 'dropzone dropzone-active' : 'dropzone'}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Go ahead</p>
          ) : (
            <>
              <p>Drag 'n drop files here</p>
            </>
          )}
        </div>
        {files.map((file) => (
          <figure key={file.preview}>
            <Img src={file.preview} alt={file.name} loading="lazy" />
            <figcaption>{file.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
