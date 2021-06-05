import { useImage } from '../../contexts';
import { AiOutlineCopy } from 'react-icons/ai';

export default function ImageProperties() {
  const { focused } = useImage();

  return (
    <>
      {focused && (
        <div className="flex flex-col items-center gap-y-3">
          <div className="w-3/4 mb-4 h-min transition-all duration-1000">
            <img
              src={focused.downloadURL}
              alt={focused.name}
              className="object-contain max-h-64 w-full h-full rounded-md"
            ></img>
          </div>
          <textarea
            value={focused.name}
            rows={2}
            className="w-full bg-[#2D2D2D] rounded-md border border-mask px-1 max-w-sm"
          />
          <textarea
            placeholder="notes..."
            rows={4}
            className="w-full bg-[#2D2D2D] rounded-md border border-mask p-2 max-w-sm"
          />
          <textarea
            placeholder="source"
            rows={1}
            className="w-full bg-[#2D2D2D] rounded-md border border-mask p-2 max-w-sm"
          />
          <div className="w-full flex flex-col gap-y-1">
            <h3 className="text-lg font-md">Information</h3>
            <p>
              Size<span className="float-right">{focused.size} KB</span>
            </p>
            <p>
              Image type<span className="float-right">{focused.contentType}</span>
            </p>
            <p>
              Link
              <button className="float-right inline-flex flex-row items-center gap-x-2">
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
