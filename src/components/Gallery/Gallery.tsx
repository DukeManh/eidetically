import { useDrop } from 'react-use';
import { useLayout, useLibrary } from '../../contexts';
import { Switch, Route } from 'react-router-dom';
import Images from './Images';
import TopBar from './TopBar';
import Welcome from './Welcome';

export default function Gallery() {
  const { navigation, properties, isMobile } = useLayout();
  const { uploadImages } = useLibrary();

  useDrop({
    onFiles: (files) => uploadImages(files),
  });

  return (
    <div
      className="h-screen relative flex flex-col justify-start pb-8"
      id="gallery"
      style={{
        marginLeft: navigation.visible && !isMobile ? navigation.width : '0',
        marginRight: properties.visible && !isMobile ? properties.width : '0',
      }}
    >
      <TopBar />

      <div className="flex-grow overflow-y-auto min-h-0 pt-6 px-4 pb-16">
        <Switch>
          <Route path="/" exact>
            <Welcome />
          </Route>
          <Route path="/:libParam">
            <Images />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
