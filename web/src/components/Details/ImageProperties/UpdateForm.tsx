import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useDebounce } from 'react-use';
import toast from 'react-hot-toast';
import { CSSTransition } from 'react-transition-group';

import { ImageProps } from '.';
import { MutableImageProperties } from '../../../interfaces';
import { updateImageProperties } from '../../../server/service';
import { deepEqual } from '../../../utilities';

export default function Form({ image }: ImageProps) {
  const initialState: MutableImageProperties = useMemo(
    () => ({
      name: image.name || '',
      note: image.note || '',
      source: image.source || '',
    }),
    [image.name, image.note, image.source]
  );

  useEffect(() => {
    setProperties(initialState);
  }, [initialState]);

  const [unsaved, setUnsaved] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [properties, setProperties] = useState<MutableImageProperties>(initialState);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setProperties((props) => ({
      ...props,
      [e.target.name]: e.target.value,
    }));
  };

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
      await updateImageProperties(image, properties);
      toast.success('Image properties updated');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
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
  );
}
