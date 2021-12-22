import { HiMinusSm, HiPlusSm } from 'react-icons/hi';

import { useLayout } from '../../../contexts';

export default function Zoom() {
  const { zoom, setZoom, minZoom, maxZoom } = useLayout();

  return (
    <div className="flex flex-row items-center justify-around">
      <button className="buttonIcon" onClick={() => setZoom(zoom - 1)}>
        <HiMinusSm size={30} onClick={() => setZoom(zoom - 1)} />
      </button>
      <input
        className="zoom-slider"
        type="range"
        value={zoom}
        onChange={(e) => setZoom(parseInt(e.target.value))}
        min={minZoom}
        max={maxZoom}
        step={1}
      ></input>
      <button className="buttonIcon" onClick={() => setZoom(zoom + 1)}>
        <HiPlusSm size={30} />
      </button>
    </div>
  );
}
