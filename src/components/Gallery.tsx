import { navigationBarCollapsed } from '../utilities/breakpoints';

const Header = () => {
  const navCollapsed = navigationBarCollapsed();

  return (
    <div className="flex flex-row justify-between items-center">
      <div>Name</div>
      <div>Slider</div>
      <div>Search</div>
    </div>
  );
};

export default function Gallery() {
  return (
    <div className="md:mx-[250px]">
      <Header />
    </div>
  );
}
