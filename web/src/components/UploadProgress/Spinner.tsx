export interface SpinnerProps {
  size?: number;
}

export default function Spinner({ size }: SpinnerProps) {
  const animation = `rotation 700ms cubic-bezier(0.37, 0, 0.63, 1) ${
    Math.random() * 701
  }ms infinite`;
  return (
    <div
      className="spinner"
      style={{
        animation,
      }}
    >
      <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" width={size || 18}></img>
    </div>
  );
}
