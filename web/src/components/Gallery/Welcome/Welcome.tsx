import { useCallback, useEffect } from 'react';
import fitty from 'fitty';
import ReactTooltip from 'react-tooltip';

import { useLayout } from '../../../contexts';
import { debounce } from '../../../utilities';

import PreviewSlide from './PreviewSlide';

const fit = () =>
  fitty('.fit-text', {
    maxSize: 54,
  });

const fitText = debounce(fit, 1000);

export default function Welcome() {
  const { navigationVisible, navigationWidth, detailsVisible } = useLayout();
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
                draggable={false}
                className="rounded-md shadow-md active:translate-y-[1px] select-none"
              ></img>
              <ReactTooltip
                id="chrome-store-tooltip"
                type="dark"
                effect="float"
                delayShow={500}
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
          <PreviewSlide />
        </div>
      </div>
    </div>
  );
}
