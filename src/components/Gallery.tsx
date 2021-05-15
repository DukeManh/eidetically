import { Slider } from 'antd';
import { HiMenuAlt2 } from 'react-icons/hi';

import { navigationBarCollapsed } from '../utilities/breakpoints';

const Header = () => {
  const navCollapsed = navigationBarCollapsed();
  console.log(navCollapsed);

  return (
    <div className="flex flex-row justify-between items-center">
      <div>
        {navCollapsed && <HiMenuAlt2 />}
        <p>Name</p>
      </div>
      <div className="w-36">
        <Slider defaultValue={30} tooltipVisible={false} />
      </div>
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
