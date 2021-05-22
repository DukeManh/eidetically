import { LayoutProvider, ImageProvider } from './contexts/';
import Navigation from './components/Navigation';
import Properties from './components/Properties';
import Gallery from './components/Gallery';
import MenuBar from './components/Menubar';

function App() {
  return (
    <LayoutProvider>
      <ImageProvider>
        <MenuBar />
        <main className="bg-primary max-h-screen overflow-hidden relative text-gray-50">
          <Navigation />
          <Gallery />
          <Properties />
        </main>
      </ImageProvider>
    </LayoutProvider>
  );
}

export default App;
