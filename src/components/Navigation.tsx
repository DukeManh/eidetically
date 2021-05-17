import { useLayout } from '../contexts/layout';

export default function Navigation() {
  const { navigationVisible, isMobile, toggleNavigation } = useLayout();

  return (
    <>
      <button
        onClick={() => toggleNavigation(false)}
        className={isMobile && navigationVisible ? 'mask mask-active' : 'mask'}
      ></button>
      <aside
        id="navigation"
        style={{
          left: !navigationVisible ? '-18rem' : '0',
          zIndex: 1000,
        }}
      ></aside>
    </>
  );
}
