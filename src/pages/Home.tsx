import MenuBar from '../components/Menubar';
import Navigation from '../components/Navigation';
import Properties from '../components/Properties';
import Gallery from '../components/Gallery';

export default function Home() {
  return (
    <main className="text-gray-50 bg-primary ">
      <div id="contextmenu-container"></div>
      <MenuBar />
      <div className="max-h-screen overflow-hidden relative">
        <Navigation />
        <Gallery />
        <Properties />
      </div>
    </main>
  );
}
