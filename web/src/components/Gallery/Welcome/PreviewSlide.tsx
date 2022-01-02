import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ThumbsOptions } from 'swiper/types/components/thumbs';

import { classNames } from '../../../utilities';
import previews from './previewsImages';

export default function PreviewSlide() {
  const [thumbsSwiper, setThumbsSwiper] = useState<ThumbsOptions['swiper']>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="my-6 mx-2 slides">
      <Swiper
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        centeredSlides
        updateOnWindowResize
        keyboard
        slidesPerView={1}
        className="w-full"
        lazy
        setWrapperSize
        autoHeight
        autoplay={{
          delay: 5000,
        }}
        style={{ zIndex: 10 }}
      >
        {previews.map((preview) => (
          <SwiperSlide key={preview.url}>
            <div className="flex flex-row justify-center items-center rounded-lg overflow-hidden">
              <img
                src={preview.url}
                alt={preview.alt}
                draggable="false"
                className="select-none w-full h-full object-contain rounded-lg"
                style={{ maxHeight: '35rem' }}
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={(swiper) => setThumbsSwiper(swiper)}
        spaceBetween={10}
        slidesPerView={5}
        watchSlidesProgress
        className="cursor-pointer preview-slides my-2 md:my-4 overflow-y-visible"
        lazy
        setWrapperSize
        threshold={1000}
        autoplay
        breakpoints={{
          678: {
            slidesPerView: 8,
          },
        }}
        centeredSlides
        centeredSlidesBounds
        style={{ zIndex: 10 }}
      >
        {previews.map((preview, i) => (
          <SwiperSlide
            key={preview.alt}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <figure>
              <div
                className={classNames(
                  'h-full hover:opacity-100 transition-opacity duration-200',
                  activeIndex !== i && 'opacity-40'
                )}
              >
                <img
                  src={preview.previewUrl}
                  alt={preview.alt}
                  draggable="false"
                  className="select-none w-full h-full object-contain rounded-md"
                  style={{ maxHeight: '4rem' }}
                  loading="lazy"
                />
              </div>
              <figcaption className="text-center text-xs text-gray-400 font-mono line-clamp-2 pt-2">
                {preview.alt}
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
