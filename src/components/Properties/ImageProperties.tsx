import { useImage } from '../../contexts';
import { AiOutlineCopy } from 'react-icons/ai';

export default function ImageProperties() {
  const { focused } = useImage();

  return (
    <>
      {focused && (
        <div className="flex flex-col items-center space-y-3">
          <div className="w-3/4 mb-4 h-min">
            <img
              src={focused.downloadURL}
              alt={focused.name}
              className="object-contain max-h-64 w-full h-full rounded-sm"
            ></img>
          </div>
          <textarea
            onChange={() => {}}
            value={focused.name}
            rows={2}
            className="image-properties-input"
          />
          <textarea
            onChange={() => {}}
            placeholder="notes..."
            rows={4}
            className="image-properties-input"
          />
          <textarea
            onChange={() => {}}
            placeholder="source"
            rows={1}
            className="image-properties-input"
          />
          <div className="w-full flex flex-col space-y-1">
            <h3 className="text-lg font-md">Information</h3>
            <p>
              Size<span className="float-right">{focused.size} KB</span>
            </p>
            <p>
              Image type<span className="float-right">{focused.contentType}</span>
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
      )}
    </>
  );
}
