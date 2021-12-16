export interface SpinnerProps {
  size?: number;
}

export default function Spinner({ size }: SpinnerProps) {
  const animationDelay = `${Math.random() * 701}ms`;

  return (
    <div
      className="spinner rotate"
      style={{
        animationDelay,
      }}
    >
      <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" width={size || 18}></img>
    </div>
  );
}
