import { IconContext } from 'react-icons';
import ReactTooltip from 'react-tooltip';

import { MdContentPaste } from 'react-icons/md';
import { BiCut, BiSelectMultiple } from 'react-icons/bi';
import { IoIosCloseCircle, IoIosCopy } from 'react-icons/io';
import { RiDeleteBin7Fill, RiSlideshow2Fill, RiImageEditFill } from 'react-icons/ri';
import { ImCloudUpload, ImCloudDownload } from 'react-icons/im';

import { useImage, useAuth, useLibrary } from '../../contexts';
import FileUploadButton from '../FileUploadButton';

export default function ToolBox() {
  const {
    startSelecting,
    cancelSelecting,
    selecting,
    focused,
    deleteSelection,
    toggleSlide,
    toggleEditor,
    cutToClipboard,
    copyToClipboard,
    paste,
    clipboard,
    selectedItemsNum,
  } = useImage();

  const { activeLibrary } = useLibrary();

  const { user } = useAuth();

  const atLeastOneSelected = selectedItemsNum > 0;
  const oneFocused = !!focused;
  const Tools = [
    {
      name: 'Select',
      handleClick: startSelecting,
      children: <BiSelectMultiple />,
      disabled: false,
      hidden: selecting,
    },
    {
      name: 'Cancel',
      handleClick: cancelSelecting,
      children: <IoIosCloseCircle />,
      disabled: false,
      hidden: !selecting,
    },
    {
      name: 'Copy',
      handleClick: () => activeLibrary && copyToClipboard(activeLibrary.id),
      children: <IoIosCopy />,
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Cut',
      handleClick: () => activeLibrary && cutToClipboard(activeLibrary.id),
      children: <BiCut />,
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Paste',
      handleClick: () => activeLibrary && paste(activeLibrary.id),
      children: <MdContentPaste />,
      disabled: selecting || !clipboard || clipboard?.fromLibrary === activeLibrary?.id,
    },
    {
      name: 'Delete',
      handleClick: deleteSelection,
      children: <RiDeleteBin7Fill />,
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Slide',
      handleClick: () => toggleSlide(),
      children: <RiSlideshow2Fill />,
      disabled: selecting && !atLeastOneSelected,
    },
    {
      name: 'Upload',
      handleClick: () => {},
      children: (
        <FileUploadButton disabled={atLeastOneSelected}>
          <ImCloudUpload className="mx-auto" />
        </FileUploadButton>
      ),
      disabled: atLeastOneSelected,
    },
    {
      name: 'Edit',
      handleClick: () => toggleEditor(),
      children: <RiImageEditFill />,
      disabled: !oneFocused || (selecting && selectedItemsNum !== 1),
    },
    {
      name: 'Save',
      handleClick: () => {},
      children: <ImCloudDownload />,
      disabled: !atLeastOneSelected,
    },
  ];

  return (
    <IconContext.Provider value={{ size: '22' }}>
      <div className="flex flex-wrap justify-center">
        {Tools.map(({ hidden, disabled, children, handleClick, name }) => (
          <div
            key={name}
            data-tip
            data-for={`${name}-tooltip`}
            className={hidden ? 'hidden w-0 h-0' : 'toolbox-button'}
          >
            {!hidden && (
              <>
                <button disabled={!user || disabled} onClick={() => handleClick()}>
                  {children}
                </button>
                <ReactTooltip
                  id={`${name}-tooltip`}
                  type="dark"
                  effect="solid"
                  delayShow={1000}
                  delayHide={100}
                  className="z-50 duration-100 mt-0 p-0 bg-alert shadow-sm text-xs rounded py-1 px-3"
                >
                  <span>{name}</span>
                </ReactTooltip>
              </>
            )}
          </div>
        ))}
      </div>
    </IconContext.Provider>
  );
}
