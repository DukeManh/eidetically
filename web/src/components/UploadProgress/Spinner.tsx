import { useState } from 'react';

export interface SpinnerProps {
  size?: number;
}

const borders = ['borderLeftColor', 'borderRightColor', 'borderBottomColor', 'borderTopColor'];
const missingBorder = () => borders[Math.floor(Math.random() * 4)];

export default function Spinner({ size }: SpinnerProps) {
  const [border] = useState(missingBorder());
  return (
    <div
      className="spinner"
      style={{
        height: size ? size : '1rem',
        width: size ? size : '1rem',
        borderColor: '#3EDBF0',
        borderRadius: '100%',
        borderWidth: size ? `${(size * 0.2).toFixed(0)}px` : '3px',
        [border]: 'gray',
        animation: 'rotation 1000ms cubic-bezier(0.37, 0, 0.63, 1) infinite',
      }}
    ></div>
  );
}
