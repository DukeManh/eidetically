import { ReactChild } from 'react';

import Separator from '../Separator';

type DataFiled = {
  name: ReactChild;
  value: ReactChild;
};

function DataField({ name, value }: DataFiled) {
  return (
    <div>
      <span className="text-gray-300">{name}</span>
      <span className="float-right">{value}</span>
    </div>
  );
}

type InformationProps = {
  infos: DataFiled[];
};

export default function Information({ infos }: InformationProps) {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col space-y-2">
        <h3 className="text-lg font-bold mb-2">Information</h3>
        {infos.map(({ name, value }, i) => (
          <>
            <DataField name={name} value={value} />
            {i < infos.length - 1 && <Separator />}
          </>
        ))}
      </div>
    </div>
  );
}
