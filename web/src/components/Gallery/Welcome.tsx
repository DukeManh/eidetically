import { useCallback, useEffect, useState } from 'react';
import fitty from 'fitty';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReactTooltip from 'react-tooltip';

import { useLayout } from '../../contexts';
import { debounce } from '../../utilities';
import { ThumbsOptions } from 'swiper/types/components/thumbs';

const fit = () =>
  fitty('.fit-text', {
    maxSize: 54,
  });

const fitText = debounce(fit, 1000);

const previews = [
  {
    url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fd0b98102-4f92-4925-90a1-64165478bc7a?alt=media&token=88e53def-5101-4962-8646-d4cbd7bfb35c',
    previewUrl:
      'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fd0b98102-4f92-4925-90a1-64165478bc7a-preview?alt=media&token=c2d978ca-9582-4eb1-b918-bedd9a786e71',
    alt: 'eidetically extension',
  },
  {
    url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fe9be0844-3965-4894-ad15-5a88099e42b5?alt=media&token=8ca0b148-e15b-4484-9621-028a8a5ad48d',
    previewUrl:
      'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fe9be0844-3965-4894-ad15-5a88099e42b5-preview?alt=media&token=f5faa357-4b9f-4a4e-98fb-2e7b09cf5bb2',
    alt: 'Authenticate extension',
  },
  {
    url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F9f79aa99-fabd-438b-a755-039fd0987a25?alt=media&token=d5c2fc8a-592b-4d33-a4a0-5c5007d23198',
    previewUrl:
      'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F9f79aa99-fabd-438b-a755-039fd0987a25-preview?alt=media&token=d98ff0a2-eec4-445b-9ed1-bd928b1901f5',
    alt: "Drag 'n Drop",
  },
  {
    url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F00cfe3ef-373a-4856-9bb4-dddf6e1f98e2?alt=media&token=cd674166-a712-4dc2-a7b0-4273a0500924',
    previewUrl:
      'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F00cfe3ef-373a-4856-9bb4-dddf6e1f98e2-preview?alt=media&token=8104446d-1f19-482d-96ef-edd470ae44aa',
    alt: 'Waterfall layout',
  },
  {
    url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fe1937798-8f41-4e33-961c-448c8809d827?alt=media&token=98da4267-8693-4bce-938b-c9c8eaba74e9',
    previewUrl:
      'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fe1937798-8f41-4e33-961c-448c8809d827-preview?alt=media&token=7ec04689-d29c-4871-b2e5-91db82e34037',
    alt: 'Justified layout',
  },
  // {
  //   url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F6b5dd41a-a3cc-4d69-b2b6-8913629f868a?alt=media&token=08c64cdd-0621-4bbc-9a52-b891b90961af',
  //   previewUrl:
  //     'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F6b5dd41a-a3cc-4d69-b2b6-8913629f868a-preview?alt=media&token=ee1e6c06-c578-4ee0-97a1-e4ccd8e3b02f',
  //   alt: 'Upload progress',
  // },
  // {
  //   url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F33b6c579-bf75-48ba-96c0-635f2c3193d5?alt=media&token=8eb704ec-86d0-4711-be0c-d1262e9c709e',
  //   previewUrl:
  //     'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F33b6c579-bf75-48ba-96c0-635f2c3193d5-preview?alt=media&token=34669668-2bbe-426c-9dbe-a86bb28e290e',
  //   alt: 'Waterfall layout',
  // },
  // {
  //   url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fe4043f39-458f-4302-be75-79ebf90a372c?alt=media&token=c6474905-bb0d-435b-bb28-372001d5fe11',
  //   previewUrl:
  //     'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fe4043f39-458f-4302-be75-79ebf90a372c-preview?alt=media&token=b5bd4397-9108-40d2-a776-ba1073fcf35e',
  //   alt: 'Justified layout',
  // },
  // {
  //   url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fa1ee0d7c-a202-4682-ab6e-56b0929e2b75?alt=media&token=104d46fe-5c6b-496e-a356-e077d7d17ab9',
  //   previewUrl:
  //     'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2Fa1ee0d7c-a202-4682-ab6e-56b0929e2b75-preview?alt=media&token=5c50490f-237c-4231-9b49-b009abd8a8e6',
  //   alt: 'Zoom level',
  // },
  // {
  //   url: 'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F0b218379-8c9b-4b31-801a-828f7496099d?alt=media&token=33fc8ce7-e9e9-45af-9d61-633d97a1fffc',
  //   previewUrl:
  //     'https://firebasestorage.googleapis.com/v0/b/dropit-7ae30.appspot.com/o/kBrRXi3N9rVeS2MMIRNI7hdu5mC2%2FRubb4KzkaGgZFGvOBhMp%2F0b218379-8c9b-4b31-801a-828f7496099d-preview?alt=media&token=e0ce9127-bf5b-488d-bbec-c3a36a81fe86',
  //   alt: 'Image details',
  // },
];

export default function Welcome() {
  const { navigationVisible, navigationWidth, detailsVisible } = useLayout();
  const [thumbsSwiper, setThumbsSwiper] = useState<ThumbsOptions['swiper']>(null);

  const reFit = useCallback(fitText, []);

  useEffect(() => {
    fit();
  }, []);

  useEffect(() => {
    reFit();
  }, [navigationVisible, navigationWidth, detailsVisible, reFit]);

  useEffect(() => {
    document.addEventListener('resize', reFit);
    return window.removeEventListener('resize', reFit);
  }, [reFit]);

  return (
    <div className="w-full flex-grow min-h-0 overflow-y-scroll">
      <div className="p-4 lg:p-6 max-w-5xl mx-auto">
        <div className="w-full text-[#D3D6DB] py-5 mb-10 ">
          <h1 className="font-bold font-serif fit-text leading-normal">
            Saving and Organizing images
          </h1>
          <br />
          <h1 className="font-extrabold font-serif fit-text leading-none text-[#04D4C6]">
            made easy
          </h1>
        </div>
        <div className="mb-8">
          <p className="text-lg font-thin">
            ✨ <span className="text-green-300">Eidetically</span> allows you to save images easily
            and logically organize them. You can import images locally or use our extension to drag
            and drop images from any website right into here. This makes collecting images, ideas,
            digital assets for revisiting later a breeze ✨
          </p>
        </div>
        <div>
          <h2 className="font-bold text-3xl font-mono">Install Eidetically extension</h2>
          <figure className="text-center max-w-xs md:max-w-sm p-8 mx-auto">
            <a
              href="https://chrome.google.com/webstore/detail/eidetically-extension/lpkoidkenibcddnjhnnmfdaoognjjpal?hl=en-US&authuser=1"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/HRs9MPufa1J1h5glNhut.png"
                alt="availabe in Chrome Store badge"
                data-tip
                data-for="chrome-store-tooltip"
                className="rounded-md shadow-md"
              ></img>
              <ReactTooltip
                id="chrome-store-tooltip"
                type="dark"
                effect="float"
                delayShow={200}
                delayHide={100}
                place="left"
                offset={{ left: 10 }}
                className="z-[999] duration-100 mt-0 p-0 bg-alert shadow-sm text-xs rounded py-1 px-3"
              >
                eidetically-extension/lpkoidkenibcddnjhnnmfdaoognjjpal
              </ReactTooltip>
            </a>
            <figcaption className="text-sm text-gray-400 mt-2">
              Available in the Chrome Store
            </figcaption>
          </figure>
        </div>
        <div>
          <h2 className="font-bold text-3xl font-mono">Your digital assets organizer</h2>
          <div className="my-6 mx-2">
            <Swiper
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              centeredSlides={true}
              updateOnWindowResize
              keyboard
              slidesPerView={1}
              className="border-2 border-textArea shadow-inner rounded-md max-h-[768px] select-none"
              lazy
            >
              {previews.map((preview) => (
                <SwiperSlide key={preview.url}>
                  <img
                    src={preview.url}
                    alt={preview.alt}
                    draggable="false"
                    className="select-none"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={(swiper) => setThumbsSwiper(swiper)}
              spaceBetween={10}
              slidesPerView={10}
              watchSlidesProgress={true}
              className="cursor-pointer"
              allowTouchMove={false}
              lazy
              draggable={false}
            >
              {previews.map((preview) => (
                <SwiperSlide key={preview.previewUrl} className="my-4">
                  <img
                    src={preview.previewUrl}
                    alt={preview.alt}
                    draggable="false"
                    className="select-none"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
