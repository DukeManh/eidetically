import { useLayout } from '../contexts/layout';

export default function Properties() {
  const { propertiesVisible, isMobile, toggleProperties } = useLayout();

  return (
    <>
      <button
        onClick={() => toggleProperties(false)}
        className={isMobile && propertiesVisible ? 'mask mask-active' : 'mask'}
      ></button>
      <aside
        id="properties"
        style={{
          right: !propertiesVisible ? '-18rem' : '0',
        }}
      ></aside>
    </>
  );
}
