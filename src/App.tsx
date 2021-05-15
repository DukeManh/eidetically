import './app.less';

import Navigation from './components/Navigation';
import Properties from './components/Properties';
import Gallery from './components/Gallery';

function App() {
  return (
    <div className="bg-background w-full h-full overflow-hidden text-gray-50">
      <Navigation />
      <Gallery />
      <Properties />
    </div>
  );
}

export default App;
