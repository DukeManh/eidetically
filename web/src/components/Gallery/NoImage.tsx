export default function NoImage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <div className="w-3/4 sm:w-1/3">
        <img src={`${process.env.PUBLIC_URL}/uploadMedia.svg`} alt="No Results"></img>
      </div>
      <div className="font-medium text-lg font-serif">Upload or import here</div>
    </div>
  );
}
