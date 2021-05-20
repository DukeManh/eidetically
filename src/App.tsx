import { LayoutProvider } from './contexts/layout';
import Navigation from './components/Navigation';
import Properties from './components/Properties';
import Gallery from './components/Gallery';
import MenuBar from './components/MenuBar';

function App() {
  return (
    <LayoutProvider>
      <MenuBar />
      <main className="bg-primary max-h-screen overflow-hidden relative text-gray-50">
        <Navigation />
        <Gallery />
        <Properties />
      </main>
    </LayoutProvider>
  );
}

export default App;
