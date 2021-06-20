import { Toaster } from 'react-hot-toast';

import MenuBar from '../components/Menubar';
import Navigation from '../components/Navigation';
import Properties from '../components/Properties';
import Gallery from '../components/Gallery';
import UploadProgress from '../components/UploadProgress';

export default function Home() {
  return (
    <main className="text-gray-50 bg-primary ">
      <Toaster
        toastOptions={{
          style: {
            background: '#1F1F1F',
            color: 'rgba(249, 250, 251)',
          },
          duration: 3000,
        }}
      />
      <UploadProgress />
      <MenuBar />
      <div className="max-h-screen overflow-hidden relative">
        <Navigation />
        <Gallery />
        <Properties />
      </div>
    </main>
  );
}
