import { IconContext } from 'react-icons';

import { MdCreateNewFolder } from 'react-icons/md';
import { BiCut, BiSelectMultiple } from 'react-icons/bi';
import { IoIosCloseCircle, IoIosCopy } from 'react-icons/io';
import { RiDeleteBin7Fill, RiSlideshow2Fill, RiEditBoxFill } from 'react-icons/ri';
import { ImCloudUpload, ImCloudDownload } from 'react-icons/im';

import { useImage, useAuth } from '../../contexts';
import Tooltip from '../Tooltip';

export default function ToolBox() {
  const {
    startSelecting,
    cancelSelecting,
    selecting,
    focused,
    deleteSelection,
    toggleSlide,
    selection,
  } = useImage();

  const { user } = useAuth();

  const atLeastOneSelected = !!Object.values(selection).filter((image) => !!image).length;
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
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Upload',
      handleClick: () => {},
      children: <ImCloudUpload />,
      disabled: false,
    },
    {
      name: 'Edit',
      handleClick: () => {},
      children: <RiEditBoxFill />,
      disabled: !oneFocused,
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
          <Tooltip key={name} text={name}>
            <div className={hidden ? 'hidden w-0 h-0' : 'toolbox-button'}>
              {!hidden && (
                <button disabled={!user || disabled} onClick={() => handleClick()}>
                  {children}
                </button>
              )}
            </div>
          </Tooltip>
        ))}
      </div>
    </IconContext.Provider>
  );
}
