import { useState, useEffect } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { GoChevronDown } from 'react-icons/go';

import task, { listeners, State, defaultState } from './task';

import TaskProgress from './UploadTask';

export default function UploadProgress() {
  const [state, setState] = useState<State>(defaultState);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    listeners.push(setState);

    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  if (!state.tasks.length) return null;

  return (
    <div className="w-72 md:w-80 text-gray-300 z-50 fixed bottom-8 right-8 overflow-hidden rounded-md shadow">
      <div className="bg-alert h-12 overflow-hidden p-2 relative flex flex-row items-center space-x-3 font-medium">
        <div className="pl-2">{`Uploaded ${state.uploaded}/${state.uploadsCount}`}</div>
        <div className="flex-grow"></div>
        <GoChevronDown
          style={{
            transform: minimized ? 'rotate(180deg)' : 'none',
          }}
          className="progressBar-icon"
          onClick={() => setMinimized(!minimized)}
        />
        <IoCloseSharp className="progressBar-icon" onClick={() => task.clear()} />

        {state.uploading && (
          <div
            className="progress absolute w-full h-[3px] bottom-0"
            style={{
              right: `${100 - Math.floor((state.uploaded / state.uploadsCount) * 100)}%`,
            }}
          ></div>
        )}
      </div>

      <div
        className="bg-progressBar overflow-scroll transition-dimension flex flex-col"
        style={{
          height: minimized ? '0' : '12rem',
        }}
      >
        {state.tasks.map((task) => (
          <TaskProgress key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
