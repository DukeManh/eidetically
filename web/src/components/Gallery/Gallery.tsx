import { Switch, Route } from 'react-router-dom';

import { useLayout } from '../../contexts';

import ImageContainer from './ImageContainer';
import TopBar from './TopBar';
import Welcome from './Welcome';

export default function Gallery() {
  const { navigationVisible, propertiesVisible, navigationWidth, DefaultSidebarWidth, isMobile } =
    useLayout();

  return (
    <div
      className="galleryWrap"
      style={{
        marginLeft: navigationVisible && !isMobile ? navigationWidth : '0',
        marginRight: propertiesVisible && !isMobile ? DefaultSidebarWidth : '0',
      }}
    >
      <TopBar />

      <div className="flex-grow overflow-y-auto px-4 p-2 flex flex-col">
        <Switch>
          <Route path="/" exact>
            <Welcome />
          </Route>

          <Route path="/libraries/:libParam">
            <ImageContainer />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
