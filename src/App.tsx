import { BrowserRouter } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { LayoutProvider, LibraryProvider, AuthProvider, ImageProvider } from './contexts/';
import Home from './pages/Home';

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
