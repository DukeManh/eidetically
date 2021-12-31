import { useCallback, useEffect } from 'react';
import fitty from 'fitty';

import { useLayout } from '../../contexts';
import { debounce } from '../../utilities';

const fitText = debounce(() => {
  fitty('.fit-text', {
    maxSize: 54,
  });
}, 1000);

export default function Welcome() {
  const { navigationVisible, navigationWidth, detailsVisible } = useLayout();

  const reFit = useCallback(fitText, []);

  useEffect(() => {
    fitty('.fit-text', {
      maxSize: 54,
    });
  }, []);

  useEffect(() => {
    reFit();
  }, [navigationVisible, navigationWidth, detailsVisible, reFit]);

  useEffect(() => {
    document.addEventListener('resize', reFit);
    return window.removeEventListener('resize', reFit);
  }, [reFit]);

  return (
    <div className="w-full p-4 lg:p-6 flex-grow min-h-0 overflow-y-scroll">
      <div className="w-full text-[#D3D6DB]">
        <h1 className="font-bold font-serif fit-text">Saving and Organizing images</h1>
        <h1 className="font-bold font-serif fit-text leading-none text-[#04D4C6]">made easy</h1>
      </div>
      <div className="mt-4">
        <p className="">
          MDX allows you to use JSX in your markdown content. You can import components, such as
          interactive charts or alerts, and embed them within your content. This makes writing
          long-form content with components a blast. 🚀
        </p>
      </div>
    </div>
  );
}
