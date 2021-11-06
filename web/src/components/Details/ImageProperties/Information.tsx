import { ReactChild, useEffect, useState } from 'react';
import { AiOutlineCopy, AiOutlineCheck } from 'react-icons/ai';

import { ImageProps } from '.';
import { copyToClipboard } from '../../../utilities';

type DataFiledProps = {
  name: ReactChild;
  value: ReactChild;
};

function DataField({ name, value }: DataFiledProps) {
  return (
    <div>
      <span className="text-gray-300">{name}</span>
      <span className="float-right">{value}</span>
    </div>
  );
}

function Separator() {
  return <div className="h-[1px] w-full bg-gray-500"></div>;
}

export default function Information({ image }: ImageProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    setLinkCopied(false);
  }, [image.downloadURL]);
  return (
    <div className="w-full">
      <div className="w-full flex flex-col space-y-2">
        <h3 className="text-lg font-bold mb-2">Information</h3>
        <DataField name="Size" value={image.size} />
        <Separator />
        <DataField name="File type" value={image.contentType} />
        <Separator />
        <DataField
          name="Last updated"
          value={new Date((image.last_updated || image.upload_date).toMillis()).toDateString()}
        />
        <Separator />
        <DataField
          name="Upload date"
          value={new Date(image.upload_date.toMillis()).toDateString()}
        />
        <Separator />
        <DataField
          name="Link"
          value={
            <>
              <a className="text-blue-400 align-middle" href={image.downloadURL}>
                {`${image.name.slice(0, 20).trim()}${image.name.length > 20 ? '...' : ''}`}
              </a>
              <button
                className="align-middle ml-2"
                onClick={() => {
                  setLinkCopied(true);
                  copyToClipboard(image.downloadURL);
                }}
              >
                {linkCopied ? <AiOutlineCheck /> : <AiOutlineCopy />}
              </button>
            </>
          }
        />
      </div>
    </div>
  );
}
