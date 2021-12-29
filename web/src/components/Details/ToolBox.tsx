import { IconContext } from 'react-icons';
import ReactTooltip from 'react-tooltip';

import { MdContentPaste } from 'react-icons/md';
import { BiCut, BiSelectMultiple } from 'react-icons/bi';
import { IoIosCloseCircle, IoIosCopy } from 'react-icons/io';
import { RiDeleteBin7Fill, RiSlideshow2Fill, RiImageEditFill } from 'react-icons/ri';
import { ImCloudDownload } from 'react-icons/im';

import Separator from './Separator';

import { useImage, useLibrary } from '../../contexts';
import { downloadImages } from '../../server/service';
import toast from 'react-hot-toast';

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
    selection,
  } = useImage();

  const { activeLibrary } = useLibrary();

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
      name: 'Edit',
      handleClick: () => toggleEditor(),
      children: <RiImageEditFill />,
      disabled: !oneFocused || (selecting && selectedItemsNum !== 1),
    },
    {
      name: 'Save',
      handleClick: () => {
        if (activeLibrary) {
          downloadImages(activeLibrary?.name, Object.values(selection)).catch((error: Error) => {
            toast.error(`Can't download images: ${error.message}`);
          });
          cancelSelecting();
        }
      },
      children: <ImCloudDownload />,
      disabled: !atLeastOneSelected,
    },
  ];

  return (
    <IconContext.Provider value={{ size: '22' }}>
      <div>
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
                  <button disabled={!activeLibrary || disabled} onClick={handleClick}>
                    {children}
                  </button>
                  <ReactTooltip
                    id={`${name}-tooltip`}
                    type="dark"
                    effect="solid"
                    delayShow={500}
                    delayHide={100}
                    className="z-[999] duration-100 mt-0 p-0 bg-alert shadow-sm text-xs rounded py-1 px-3"
                  >
                    <span>{name}</span>
                  </ReactTooltip>
                </>
              )}
            </div>
          ))}
        </div>
        <Separator />
      </div>
    </IconContext.Provider>
  );
}
