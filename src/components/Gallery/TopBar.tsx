import { HiMenuAlt2, HiMenuAlt3 } from 'react-icons/hi';
import { useLayout } from '../../contexts';

export default function TopBar() {
  const { navigation, updateNavigation, properties, updateProperties, zoom, setZoom } = useLayout();

  return (
    <div className="md:px-4 h-10 top-0 flex flex-row justify-between items-center">
      <HiMenuAlt2
        size={24}
        className="cursor-pointer"
        onClick={() => {
          updateNavigation({ visible: !navigation.visible });
        }}
      />

      <div>My workspace</div>

      <input
        className="w-36"
        type="range"
        value={zoom}
        onChange={(e) => setZoom(parseInt(e.target.value))}
        min={100}
        max={900}
        step={50}
      />

      <div>Search</div>

      <HiMenuAlt3
        size={24}
        className="cursor-pointer"
        onClick={() => {
          updateProperties({ visible: !properties.visible });
        }}
      />
    </div>
  );
}
