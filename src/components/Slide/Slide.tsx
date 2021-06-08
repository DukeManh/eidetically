import { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowSize } from 'react-use';
import { ImZoomIn, ImZoomOut, ImExit } from 'react-icons/im';
import { MdAspectRatio } from 'react-icons/md';
import Mask from '../Shared/Mask';
import { useImage } from '../../contexts';

export default function Slides() {
  const { focused, toggleSlide } = useImage();
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const boxHeight = windowHeight;
  const [zoom, setZoom] = useState(0.8);
  const image = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 100, y: -100 });

  useEffect(() => {
    if (image?.current) {
      setPosition({ y: 0, x: (windowWidth - image?.current.offsetWidth) / 2 });
    }
  }, [image, windowWidth]);

  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 5));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.25));
  };

  const reset = () => {
    if (image?.current) {
      setPosition({ y: 0, x: (windowWidth - image?.current.offsetWidth) / 2 });
    }
    setZoom(0.8);
  };

  const Buttons = [
    {
      name: 'zoom-in',
      content: <ImZoomIn />,
      onClick: zoomIn,
    },
    {
      name: 'zoom-out',
      content: <ImZoomOut />,
      onClick: zoomOut,
    },
    {
      name: 'reset',
      content: <MdAspectRatio />,
      onClick: reset,
    },
    {
      name: 'exit',
      content: <ImExit />,
      onClick: toggleSlide,
    },
  ];

  return (
    <div className="slider fixed top-0 left-0 w-full h-full z-[1000]">
      <Mask visible onClick={toggleSlide} />
      {focused && (
        <>
          <Rnd
            className="z-50"
            size={{ height: boxHeight, width: 'auto' }}
            enableResizing={false}
            position={{ ...position }}
            onDragStop={(e, pos) => setPosition(pos)}
          >
            <div
              ref={image}
              className="w-full h-full"
              style={{
                transform: `scale(${zoom})`,
              }}
            >
              <img
                src={focused.downloadURL}
                alt={focused.name}
                className="h-full object-contain select-none pointer-events-none"
              ></img>
            </div>
          </Rnd>
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-80 h-12 bg-black bg-opacity-60 z-[99]">
            <div className="slider-button w-full h-full flex flex-row justify-around gap-3 text-gray-100">
              {Buttons.map(({ name, onClick, content }) => (
                <button onClick={onClick} key={name} className="h-full hover:bg-primary flex-grow">
                  {content}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
