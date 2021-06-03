import { BrowserRouter } from 'react-router-dom';
import { LayoutProvider, LibraryProvider, AuthProvider, ImageProvider } from './contexts/';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutProvider>
          <LibraryProvider>
            <ImageProvider>
              <Home />
            </ImageProvider>
          </LibraryProvider>
        </LayoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
