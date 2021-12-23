export default function ImageNotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <div className="w-3/4 sm:w-1/3">
        <img src={`${process.env.PUBLIC_URL}/searchNotFound.svg`} alt="No Results"></img>
      </div>
      <div className="font-medium text-lg font-serif">No images found</div>
    </div>
  );
}
