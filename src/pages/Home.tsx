import MenuBar from '../components/Menubar';
import Navigation from '../components/Navigation';
import Properties from '../components/Properties';
import Gallery from '../components/Gallery';

export default function Home() {
  return (
    <div className="text-gray-50 bg-primary ">
      <div id="relative-div"></div>
      <MenuBar />
      <main className="max-h-screen overflow-hidden relative">
        <Navigation />
        <Gallery />
        <Properties />
      </main>
    </div>
  );
}
