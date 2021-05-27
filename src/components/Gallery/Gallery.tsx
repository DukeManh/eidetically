import { Switch, Route } from 'react-router-dom';
import { useDrop } from 'react-use';
import { useLayout, useStorage } from '../../contexts';
import Images from './Images';
import TopBar from './TopBar';
import Welcome from './Welcome';

export default function Gallery() {
  const { uploadFiles } = useStorage();
  const { navigation, properties, isMobile } = useLayout();

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
      <TopBar />
      <Switch>
        <Route path="/" exact>
          <Welcome />
        </Route>
        <Route path="/:libraryID">
          <Images />
        </Route>
      </Switch>
    </div>
  );
}
