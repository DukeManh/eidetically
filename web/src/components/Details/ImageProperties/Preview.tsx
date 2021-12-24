import { ImageProps } from '.';

export default function Preview({ image }: ImageProps) {
  return (
    <>
      <div className="w-full">
        <h2 className="font-semibold text-lg line-clamp-3">{image.name}</h2>
        <h2 className="text-gray-400">{image.contentType}</h2>
      </div>
      <div className="m-2 mb-4 rounded-lg overflow-hidden shadow-sm">
        <img
          src={image.downloadURL}
          alt={image.name}
          className="object-cover max-h-64 w-full h-full"
        ></img>
      </div>
    </>
  );
}
