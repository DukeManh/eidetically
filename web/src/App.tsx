import { BrowserRouter } from 'react-router-dom';
import { IconContext } from 'react-icons';
import SwiperCore, { Navigation, Pagination, A11y, Keyboard } from 'swiper';

import { LayoutProvider, LibraryProvider, AuthProvider, ImageProvider } from './contexts';
import Home from './pages/Home';

SwiperCore.use([Navigation, Pagination, A11y, Keyboard]);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutProvider>
          <LibraryProvider>
            <ImageProvider>
              <IconContext.Provider
                value={{ color: 'white', className: 'react-icons', size: '18' }}
              >
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
