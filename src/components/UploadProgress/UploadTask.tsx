import { useCallback, useState } from 'react';
import { BsFillImageFill, BsFillCameraVideoFill } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { RiErrorWarningFill } from 'react-icons/ri';
import { MdCancel } from 'react-icons/md';

import { Task } from './task';
import Spinner from './Spinner';

export interface TaskProgressProps {
  task: Task;
}

export default function TaskProgress({ task }: TaskProgressProps) {
  const [hovering, setHovering] = useState(false);

  const renderStatusIcon = useCallback(() => {
    switch (task.state) {
      case 'success':
        return <FaCheckCircle size={18} className="text-green-500" />;
      case 'loading':
        return hovering ? (
          <MdCancel
            size={20}
            className="text-red-500 cursor-pointer rounded-md overflow-hidden hover:bg-tabFocus"
            onClick={() => task.cancel()}
          />
        ) : (
          <Spinner size={18} />
        );
      default:
        return <RiErrorWarningFill size={18} className="text-red-400" />;
    }
  }, [hovering, task]);

  return (
    <div
      key={task.id}
      className="px-4 py-1 hover:bg-blue-500"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="h-8 flex flex-row space-x-4 items-center cursor-pointer">
        {task.file.type.startsWith('image') ? (
          <BsFillImageFill className="h-full" />
        ) : (
          <BsFillCameraVideoFill className="h-full" />
        )}

        <div>{task.file.name}</div>

        <div className="flex-grow"></div>

        <div>{renderStatusIcon()}</div>
      </div>
    </div>
  );
}
