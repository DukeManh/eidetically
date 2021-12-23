export interface DropZoneBackground {
  active: boolean;
}

export default function DropZoneBackground({ active }: DropZoneBackground) {
  return (
    <>
      {active && (
        <div className="w-full h-full border-[3px] border-blue-500 z-[50] absolute top-0 left-0">
          <div className="h-full dropzoneBg"></div>
        </div>
      )}
    </>
  );
}
