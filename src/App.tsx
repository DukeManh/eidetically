import { BrowserRouter } from 'react-router-dom';
import { LayoutProvider, StorageProvider, AuthProvider } from './contexts/';
import Navigation from './components/Navigation';
import Properties from './components/Properties';
import Gallery from './components/Gallery';
import MenuBar from './components/Menubar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutProvider>
          <StorageProvider>
            <MenuBar />
            <main className="bg-primary max-h-screen overflow-hidden relative text-gray-50">
              <Navigation />
              <Gallery />
              <Properties />
            </main>
          </StorageProvider>
        </LayoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
