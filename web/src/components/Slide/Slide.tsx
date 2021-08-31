import { useRef, useMemo } from 'react';
import { useKey } from 'react-use';
import { ImZoomIn, ImZoomOut, ImExit } from 'react-icons/im';
import { MdAspectRatio } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';

import { useImage } from '../../contexts';

import Mask from '../Mask';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Slides() {
  const { focused, toggleSlide, slideVisible, flattenArray, selecting, selection } = useImage();
  const imageRef = useRef<HTMLImageElement | null>(null);

  const Buttons = [
    {
      name: 'zoom-in',
      content: <ImZoomIn />,
      onClick: () => {},
    },
    {
      name: 'zoom-out',
      content: <ImZoomOut />,
      onClick: () => {},
    },
    {
      name: 'reset',
      content: <MdAspectRatio />,
      onClick: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      },
    },
    {
      name: 'exit',
      content: <ImExit />,
      onClick: () => toggleSlide(false),
    },
  ];

  useKey('Escape', () => toggleSlide(false));

  const initialSlide = useMemo(() => {
    const index = flattenArray.findIndex((img) => img.id === focused?.id);
    return index !== -1 ? index : 0;
  }, [flattenArray, focused?.id]);

  return (
    <CSSTransition in={slideVisible} timeout={200} classNames="fade-transition" unmountOnExit>
      <div className="slides">
        <Mask visible onClick={() => toggleSlide} style={{ background: 'black', opacity: 0.85 }} />
        <Swiper
          pagination={{
            dynamicBullets: true,
            dynamicMainBullets: 5,
            clickable: true,
          }}
          centeredSlides={true}
          keyboard
          updateOnWindowResize
          initialSlide={initialSlide}
          spaceBetween={50}
          slidesPerView={1}
          navigation
        >
          {(selecting ? Object.values(selection) : flattenArray).map((image) => (
            <SwiperSlide key={image.id}>
              <div className="h-[95%] pt-14">
                <div className="h-full mx-auto w-max shadow-lg">
                  <img
                    ref={imageRef}
                    src={image.downloadURL}
                    alt={image.name}
                    className="max-w-[100vw] h-full object-contain select-none pointer-events-none"
                  ></img>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-80 h-12 bg-black bg-opacity-60 z-[99]">
          <div className="slides-button w-full h-full flex flex-row justify-around space-3 text-gray-100">
            {Buttons.map(({ name, onClick, content }) => (
              <button onClick={onClick} key={name} className="h-full hover:bg-primary flex-grow">
                {content}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
