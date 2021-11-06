import { Toaster } from 'react-hot-toast';

import MenuBar from '../components/Menubar';
import Navigation from '../components/Navigation';
import Details from '../components/Details';
import Gallery from '../components/Gallery';
import UploadProgress from '../components/UploadProgress';

export default function Home() {
  return (
    <main className="text-gray-50 bg-primary flex flex-col">
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
      <div className="flex-grow overflow-hidden relative">
        <Navigation />
        <Gallery />
        <Details />
      </div>
    </main>
  );
}
