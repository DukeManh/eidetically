export default function NoImage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <div className="w-1/6 sm:w-1/12 rotate">
        <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="No Results"></img>
      </div>
      <div className="font-medium text-lg font-serif text-gray-400">Loading ...</div>
    </div>
  );
}
