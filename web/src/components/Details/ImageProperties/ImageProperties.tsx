import ImageInformation from './ImageInformation';
import UpdateForm from './UpdateForm';
import Preview from './Preview';

import { ImageProps } from '.';

export default function ImageProperties({ image }: ImageProps) {
  return (
    <div className="m-2 flex flex-col items-center space-y-4">
      <Preview image={image} />
      <UpdateForm image={image} />
      <ImageInformation image={image} />
    </div>
  );
}
