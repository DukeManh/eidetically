/* eslint-disable @typescript-eslint/no-explicit-any */
import Filerobot from 'filerobot-image-editor';

import { useImage } from '../../contexts';

export default function Editor() {
  const { focused, editorVisible, toggleEditor } = useImage();
  // const [config] = useState({
  //   theme: {
  //     colors: {
  //       primaryBg: '#3b3b3b',
  //       primaryBgHover: '#637381',
  //       secondaryBg: '#414141',
  //       secondaryBgHover: '#34444c',
  //       text: '#F9FAFB',
  //       textHover: '#fff',
  //       textMute: '#aaa',
  //       textWarn: '#f7931e',
  //       secondaryBgOpacity: 'rgba(0, 0, 0, 0.75)',
  //       accent: '#1e262c',
  //       button: {
  //         primary: '#3c4ec7',
  //         secondary: '#00707c',
  //         border: '#008D99',
  //         hover: '#5064ea',
  //       },
  //       border: '#161e23',
  //       borderLight: '#70777f',
  //       disabledBg: 'rgba(255, 0, 0, 0.1)',
  //     },
  //     // fonts: [
  //     //   { label: 'Arial', value: 'Arial' },
  //     //   { label: 'Tahoma', value: 'Tahoma' },
  //     //   { label: 'Times New Roman', value: 'Times New Roman' },
  //     //   { label: 'Courier', value: 'Courier' },
  //     //   { label: 'Courier New', value: 'Courier New' },
  //     //   { label: 'Verdana', value: 'Verdana' },
  //     // ],
  //   },
  // });

  return (
    <>
      {editorVisible && focused && (
        <Filerobot
          // config={config}
          show={editorVisible}
          src={focused.downloadURL}
          onClose={() => {
            toggleEditor(false);
          }}
          // onComplete={(props: any) => {
          //   console.log(props);
          // }}
          // onBeforeComplete={(props: any) => {
          //   console.log(props);
          //   return false;
          // }}
        />
      )}
    </>
  );
}
