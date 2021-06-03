import MenuBar from '../components/Menubar';
import Navigation from '../components/Navigation';
import Properties from '../components/Properties';
import Gallery from '../components/Gallery';

export default function Home() {
  return (
    <>
      <MenuBar />
      <main className="bg-primary max-h-screen overflow-hidden relative text-gray-50">
        <Navigation />
        <Gallery />
        <Properties />
      </main>
    </>
  );
}
