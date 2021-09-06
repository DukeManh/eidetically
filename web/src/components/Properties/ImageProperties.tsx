/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { useDebounce } from 'react-use';
import toast from 'react-hot-toast';
import { CSSTransition } from 'react-transition-group';

import { useImage } from '../../contexts';
import { deepEqual } from '../../utilities';
import { MutableImageProperties } from '../../interfaces';
import { updateImageProperties } from '../../server/service';

export default function ImageProperties() {
  const { focused } = useImage();
  const initialState: MutableImageProperties = useMemo(
    () => ({
      name: focused!.name || '',
      note: focused!.note || '',
      source: focused!.source || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focused!.name, focused!.note, focused!.source]
  );
  const [properties, setProperties] = useState<MutableImageProperties>(initialState);
  const [unsaved, setUnsaved] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setProperties(initialState);
  }, [initialState]);

  useDebounce(
    () => {
      setUnsaved(!deepEqual(initialState, properties));
    },
    1000,
    [initialState, properties]
  );

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await updateImageProperties(focused!, properties);
      toast.success('Image properties updated');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setProperties((props) => ({
      ...props,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="w-3/4 mb-4 rounded-sm overflow-hidden">
        <img
          src={focused!.downloadURL}
          alt={focused!.name}
          className="object-cover max-h-64 w-full h-full"
        ></img>
      </div>
      <form className="flex flex-col space-y-2 w-full pb-4" onSubmit={handleSubmit}>
        <textarea
          name="name"
          minLength={0}
          onChange={handleChange}
          value={properties.name}
          rows={2}
          className="imageProperties"
        />
        <textarea
          name="note"
          onChange={handleChange}
          value={properties.note}
          placeholder="notes..."
          rows={4}
          className="imageProperties"
        />
        <input
          name="source"
          onChange={handleChange}
          value={properties.source}
          placeholder="source"
          className="imageProperties"
          // rows={1}
        />
        <CSSTransition
          in={unsaved}
          unmountOnExit
          timeout={{
            enter: 2000,
            exit: 0,
          }}
          classNames={{
            enter: 'fade-transition-enter',
            enterActive: 'fade-transition-enter-active',
            enterDone: 'fade-transition-enter-done',
          }}
        >
          <div className="w-full text-gray-200 text-md flex space-x-2 pt-2">
            <div className="text-sm text-gray-300 w-min">Unsaved changes</div>
            <div className="flex-grow"></div>
            <button
              type="button"
              className="px-2 py-1 hover:bg-gray-500 hover:shadow-md rounded-sm border border-gray-200"
              onClick={() => {
                setUnsaved(false);
                setProperties(initialState);
              }}
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded-sm bg-purple-700 hover:bg-purple-600 hover:shadow-md disabled:bg-purple-800 disabled:hover:shadow-none disabled:cursor-default"
              disabled={updating}
            >
              Save
            </button>
          </div>
        </CSSTransition>
      </form>
      <div className="w-full flex flex-col space-y-1">
        <h3 className="text-lg font-md">Information</h3>
        <p>
          Size<span className="float-right">{focused!.size} KB</span>
        </p>
        <p>
          Image type<span className="float-right">{focused!.contentType}</span>
        </p>
        <p>
          Link
          <button className="float-right inline-flex flex-row items-center space-x-2">
            <span>Copy</span>
            <AiOutlineCopy />
          </button>
        </p>
      </div>
    </div>
  );
}
