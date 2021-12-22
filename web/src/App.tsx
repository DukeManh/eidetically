import { BrowserRouter } from 'react-router-dom';
import { IconContext } from 'react-icons';
import SwiperCore, { Navigation, Pagination, A11y, Keyboard } from 'swiper';

import { LayoutProvider, LibraryProvider, AuthProvider, ImageProvider } from './contexts';
import Home from './pages/Home';

SwiperCore.use([Navigation, Pagination, A11y, Keyboard]);

const IconStyles = {
  color: 'white',
  className: 'react-icons',
  size: '1.25rem',
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutProvider>
          <LibraryProvider>
            <ImageProvider>
              <IconContext.Provider value={{ ...IconStyles }}>
                <Home />
              </IconContext.Provider>
            </ImageProvider>
          </LibraryProvider>
        </LayoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
