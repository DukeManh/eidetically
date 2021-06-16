import { AiOutlineSelect, AiOutlineDelete, AiOutlineLink } from 'react-icons/ai';
import { CgCloseO } from 'react-icons/cg';
import { MdCreateNewFolder } from 'react-icons/md';
import { BiCut } from 'react-icons/bi';
import { GoCloudUpload, GoCloudDownload } from 'react-icons/go';
import { BiEdit, BiSlideshow } from 'react-icons/bi';

import { useImage, useAuth } from '../../contexts';

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
      children: <AiOutlineSelect />,
      disabled: false,
      hidden: selecting,
    },
    {
      name: 'Cancel',
      handleClick: cancelSelecting,
      children: <CgCloseO />,
      disabled: false,
      hidden: !selecting,
    },
    {
      name: 'Delete',
      handleClick: deleteSelection,
      children: <AiOutlineDelete />,
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
      children: <GoCloudDownload />,
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Slide',
      handleClick: () => toggleSlide(),
      children: <BiSlideshow />,
      disabled: !atLeastOneSelected,
    },
    {
      name: 'Upload',
      handleClick: () => {},
      children: <GoCloudUpload />,
      disabled: false,
    },
    {
      name: 'Edit',
      handleClick: () => {},
      children: <BiEdit />,
      disabled: !oneFocused,
    },
    {
      name: 'Copy',
      handleClick: () => {},
      children: <AiOutlineLink />,
      disabled: !oneFocused,
    },
  ];

  return (
    <>
      <div className="flex flex-wrap justify-center">
        {Tools.map(({ hidden, disabled, children, handleClick, name }) => (
          <div key={name} className={hidden ? 'hidden w-0 h-0' : 'toolbox-button'}>
            {!hidden ? (
              <button disabled={!user || disabled} onClick={() => handleClick()}>
                {children}
                {name}
              </button>
            ) : (
              <div className="hidden w-0 h-0"></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
