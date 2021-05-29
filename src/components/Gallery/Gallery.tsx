import { useDrop } from 'react-use';
import { useLayout, useLibrary } from '../../contexts';
import { uploadImages } from '../../server/service';
import Images from './Images';
import TopBar from './TopBar';

export default function Gallery() {
  const { navigation, properties, isMobile } = useLayout();
  const { activeLibrary } = useLibrary();

  useDrop({
    onFiles: (files) => {
      if (activeLibrary) {
        uploadImages(files, activeLibrary.id);
      }
    },
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
      {/* <Switch>
        <Route path="/" exact>
          <Welcome />
        </Route>
        <Route path="/:libraryID">
          <Images />
        </Route>
      </Switch> */}
    </div>
  );
}
