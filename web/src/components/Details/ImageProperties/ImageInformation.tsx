import { useState, useEffect } from 'react';
import { AiOutlineCheck, AiOutlineCopy } from 'react-icons/ai';

import Information from './Information';

import { ImageProps } from '.';
import { copyToClipboard } from '../../../utilities';

export default function ImageInformation({ image }: ImageProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    setLinkCopied(false);
  }, [image.downloadURL]);

  const infos = [
    { name: 'Size', value: `${image.size} KB` },
    { name: 'File type', value: image.contentType },
    {
      name: 'Last updated',
      value: new Date((image.last_updated || image.upload_date).toMillis()).toDateString(),
    },
    {
      name: 'Upload Date',
      value: new Date(image.upload_date.toMillis()).toDateString(),
    },
    {
      name: 'Link',
      value: (
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
      ),
    },
  ];
  return <Information infos={infos} />;
}
