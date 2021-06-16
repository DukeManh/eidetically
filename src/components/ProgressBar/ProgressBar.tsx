import { ReactNode } from 'react';

export interface ProgressBarProps {
  children?: ReactNode;
  progress: number;
}

export default function ProgressBar({ children, progress }: ProgressBarProps) {
  return (
    <div className="bg-progressBar text-gray-300 z-50 fixed bottom-8 right-8 w-80 h-14 overflow-hidden rounded-md p-2">
      <div
        className="progress"
        style={{
          right: `${100 - Math.min(Math.max(progress, 0), 100)}%`,
        }}
      ></div>
      {children}
    </div>
  );
}
