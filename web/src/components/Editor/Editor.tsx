import Filerobot from 'filerobot-image-editor';
import toast from 'react-hot-toast';

import { useImage } from '../../contexts';
import { updateImageSource } from '../../server/service';

const editorConfig = {
  theme: {
    colors: {
      primaryBg: '#3b3b3b',
      primaryBgHover: '#637381',
      secondaryBg: '#414141',
      secondaryBgHover: '#34444c',
      text: 'rgb(249, 250, 251)',
      textHover: '#fff',
      textMute: '#aaa',
      textWarn: '#f7931e',
      secondaryBgOpacity: 'rgba(0, 0, 0, 0.75)',
      accent: '#1e262c',
      button: {
        primary: '#4F46E5',
        secondary: '#374151',
        hover: '#6366F1',
        active: '#4338CA',
      },
      border: '#161e23',
      borderLight: '#70777f',
      disabledBg: 'rgba(255, 0, 0, 0.1)',
    },
  },
  tools: ['adjust', 'effects', 'filters', 'rotate', 'crop', 'resize', 'shapes', 'text'],
  translations: {
    en: {
      'toolbar.download': 'Save',
      'toolbar.apply': 'Apply',
      'header.image_editor_title': 'Image Editor',
    },
  },
};

export default function Editor() {
  const { focused, editorVisible, toggleEditor } = useImage();

  return (
    <>
      {editorVisible && focused && (
        <Filerobot
          config={editorConfig}
          show={editorVisible}
          src={focused.downloadURL}
          onClose={() => toggleEditor(false)}
          onBeforeComplete={({
            canvas,
            imageMime,
          }: {
            status: string;
            canvas: HTMLCanvasElement;
            imageMime: string;
          }) => {
            // Work-around to tell if image has been edited
            if (window) {
              const x = document.querySelector('div[title="Undo"]');
              if (x) {
                const { cursor } = window.getComputedStyle(x);
                const touched = cursor !== 'not-allowed';

                if (touched) {
                  canvas.toBlob(
                    async (blob) => {
                      if (!blob) {
                        console.error('Error parsing canvas');
                        return;
                      }
                      const file = new File([blob], focused.name, {
                        type: imageMime,
                        lastModified: Date.now(),
                      });
                      updateImageSource(focused, file).catch((error) => {
                        toast.error(`Error saving image: ${error}`);
                      });
                    },
                    imageMime,
                    0.8
                  );
                }
              }
            }
            return false;
          }}
        />
      )}
    </>
  );
}
