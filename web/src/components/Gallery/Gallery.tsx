import { Switch, Route } from 'react-router-dom';

import { useLayout } from '../../contexts';

import ImageContainer from './ImageContainer';
import TopBar from './TopBar';
import Welcome from './Welcome';
import Details from '../Details';

export default function Gallery() {
  const { navigationVisible, propertiesVisible, navigationWidth, DefaultSidebarWidth, isMobile } =
    useLayout();

  return (
    <div
      style={{
        marginLeft: navigationVisible && !isMobile ? navigationWidth : '0',
      }}
    >
      <TopBar />
      <div
        className="relative"
        style={{
          paddingRight: propertiesVisible && !isMobile ? DefaultSidebarWidth : '0',
        }}
      >
        <div
          className="flex-grow py-2 flex flex-col"
          style={{
            height: 'calc(100vh - 100px)',
          }}
        >
          <Switch>
            <Route path="/" exact>
              <Welcome />
            </Route>

            <Route path="/libraries/:libParam">
              <ImageContainer />
            </Route>
          </Switch>
        </div>
        <Details />
      </div>
    </div>
  );
}
