import { CSSProperties } from 'react';

type SepartorProps = {
  width?: CSSProperties['width'];
};

export default function Separator({ width }: SepartorProps) {
  return (
    <div
      className="h-[1px] bg-gray-500"
      style={{
        width: width ?? '100%',
      }}
    ></div>
  );
}
