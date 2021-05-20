import { LayoutProvider } from './contexts/layout';
import Navigation from './components/Navigation';
import Properties from './components/Properties';
import Gallery from './components/Gallery';

function App() {
  return (
    <LayoutProvider>
      <main className="bg-primary min-h-screen overflow-x-hidden relative text-gray-50">
        <Navigation />
        <Gallery />
        <Properties />
      </main>
    </LayoutProvider>
  );
}

export default App;
