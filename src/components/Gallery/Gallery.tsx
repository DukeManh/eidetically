import { useDrop } from 'react-use';
import { useLayout, useLibrary } from '../../contexts';
import Images from './Images';
import TopBar from './TopBar';

export default function Gallery() {
  const { navigation, properties, isMobile } = useLayout();
  const { uploadImages } = useLibrary();

  useDrop({
    onFiles: (files) => uploadImages(files),
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
      <TopBar />
      <Images />
    </div>
  );
}
