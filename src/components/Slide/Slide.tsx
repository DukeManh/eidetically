import { useState, useRef, useEffect, useCallback } from 'react';
import { useWindowSize } from 'react-use';
import { ImZoomIn, ImZoomOut, ImExit } from 'react-icons/im';
import { MdAspectRatio } from 'react-icons/md';
import { Rnd } from 'react-rnd';

import { useImage } from '../../contexts';
import { on, isBrowser } from '../../utilities';

import Mask from '../Mask';

export default function Slides() {
  const { focused, toggleSlide } = useImage();
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const boxHeight = windowHeight;
  const [zoom, setZoom] = useState(0);
  const image = useRef<HTMLImageElement | null>(null);
  const [position, setPosition] = useState({ x: 100, y: -100 });

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev * 1.5, 5));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev / 1.5, 0.25));
  }, []);

  const rePosition = useCallback(() => {
    if (image?.current) {
      setPosition({ y: 0, x: (windowWidth - image.current.clientWidth) / 2 });
    }
  }, [windowWidth, image]);

  const reset = useCallback(() => {
    rePosition();
    setZoom(0.8);
  }, [rePosition]);

  useEffect(() => {
    if (image?.current) {
      image.current.onload = () => {
        reset();
      };
    }
  }, [image, reset]);

  useEffect(() => {
    if (isBrowser) {
      on(window, 'resize', () => {
        rePosition();
      });
    }
  }, [rePosition]);

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
    <div className="slides">
      <Mask visible onClick={toggleSlide} />
      <div className={focused ? 'block' : 'hidden'}>
        <Rnd
          className="z-50"
          size={{ height: boxHeight, width: 'auto' }}
          style={{ left: '-50% !important' }}
          enableResizing={false}
          position={{ ...position }}
          onDragStop={(e, pos) => setPosition(pos)}
        >
          <div
            className="w-full h-full transition-transform"
            style={{
              transform: `scale(${zoom})`,
            }}
          >
            <img
              ref={image}
              src={focused?.downloadURL}
              alt={focused?.name}
              className="h-full object-contain select-none pointer-events-none"
            ></img>
          </div>
        </Rnd>
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-12 bg-black bg-opacity-60 z-[99]">
          <div className="slides-button w-full h-full flex flex-row justify-around space-3 text-gray-100">
            {Buttons.map(({ name, onClick, content }) => (
              <button onClick={onClick} key={name} className="h-full hover:bg-primary flex-grow">
                {content}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
