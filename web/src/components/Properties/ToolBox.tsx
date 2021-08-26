import { IconContext } from 'react-icons';
import ReactTooltip from 'react-tooltip';

import { MdCreateNewFolder } from 'react-icons/md';
import { BiCut, BiSelectMultiple } from 'react-icons/bi';
import { IoIosCloseCircle, IoIosCopy } from 'react-icons/io';
import { RiDeleteBin7Fill, RiSlideshow2Fill, RiImageEditLine } from 'react-icons/ri';
import { ImCloudUpload, ImCloudDownload } from 'react-icons/im';

import { useImage, useAuth } from '../../contexts';
import FileUploadButton from '../FileUploadButton';

export default function ToolBox() {
  const {
    startSelecting,
    cancelSelecting,
    selecting,
    focused,
    deleteSelection,
    toggleSlide,
    selectedItemsNum,
  } = useImage();

  const { user } = useAuth();

  const atLeastOneSelected = selectedItemsNum > 0;
  const oneFocused = !selecting && !!focused;
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
      name: 'Delete',
      handleClick: deleteSelection,
      children: <RiDeleteBin7Fill />,
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Group',
      handleClick: () => {},
      children: <MdCreateNewFolder />,
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Move',
      handleClick: () => {},
      children: <BiCut />,
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Save',
      handleClick: () => {},
      children: <ImCloudDownload />,
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Slide',
      handleClick: () => toggleSlide(),
      children: <RiSlideshow2Fill />,
      disabled: selecting,
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
      handleClick: () => {},
      children: <RiImageEditLine />,
      disabled: !oneFocused || (selecting && selectedItemsNum === 1),
    },
    {
      name: 'Copy',
      handleClick: () => {},
      children: <IoIosCopy />,
      disabled: !oneFocused,
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
                  delayShow={1500}
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
