import { AiOutlineSelect, AiOutlineDelete, AiOutlineLink } from 'react-icons/ai';
import { CgCloseO } from 'react-icons/cg';
import { MdCreateNewFolder } from 'react-icons/md';
import { BiCut } from 'react-icons/bi';
import { GoCloudUpload, GoCloudDownload } from 'react-icons/go';
import { BiEdit, BiSlideshow } from 'react-icons/bi';
import { useImage } from '../../contexts';

export default function ToolBox() {
  const { startSelecting, cancelSelecting, selecting, focused, deleteSelection, toggleSlide } =
    useImage();

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
      disabled: !selecting,
    },
    {
      name: 'Group',
      handleClick: () => {},
      children: <MdCreateNewFolder />,
      disabled: !selecting,
    },
    {
      name: 'Move',
      handleClick: () => {},
      children: <BiCut />,
      disabled: !selecting,
    },
    {
      name: 'Save',
      handleClick: () => {},
      children: <GoCloudDownload />,
      disabled: !selecting,
    },
    {
      name: 'Slide',
      handleClick: () => toggleSlide(),
      children: <BiSlideshow />,
      disabled: !focused && !selecting,
    },
    {
      name: 'Upload',
      handleClick: () => {},
      children: <GoCloudUpload />,
      disabled: selecting,
    },
    {
      name: 'Edit',
      handleClick: () => {},
      children: <BiEdit />,
      disabled: !focused || selecting,
    },
    {
      name: 'Copy',
      handleClick: () => {},
      children: <AiOutlineLink />,
      disabled: !focused || selecting,
    },
  ];

  return (
    <>
      <div className="flex flex-wrap justify-center">
        {Tools.map(({ hidden, disabled, children, handleClick, name }) => (
          <div key={name} className={hidden ? 'hidden w-0 h-0' : 'toolbox-button'}>
            {!hidden ? (
              <button disabled={disabled} onClick={() => handleClick()}>
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
