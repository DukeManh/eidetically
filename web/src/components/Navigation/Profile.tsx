import { VscLibrary, VscFileMedia, VscAccount } from 'react-icons/vsc';

import { useAuth, useLibrary } from '../../contexts';

import Avatar from './Avatar';
import { LoginButton } from '../Login';

export default function Profile() {
  const { user } = useAuth();
  const { libraries } = useLibrary();
  return (
    <div className="flex flex-row flex-wrap justify-center items-center">
      <div>
        <Avatar />
        <div className="text-center font-medium text-lg mt-1">
          {user ? user.displayName : 'Guest'}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <LoginButton />
        <div className="flex flex-row justify-items-center space-2 h-12">
          <div className="profile-stat text-[#95C2C4]">
            <VscLibrary className="h-full" color="inherit" />
            <div>{libraries.length}</div>
          </div>
          <div className="w-[1px] bg-gray-300"></div>
          <div className="profile-stat text-[#B7BF99]">
            <VscFileMedia className="h-full" color="inherit" />
            <div>{libraries.reduce((count, lib) => count + lib.image_count, 0)}</div>
          </div>
          <div className="w-[1px] bg-gray-300"></div>
          <div className="profile-stat text-[#fcd890]">
            <VscAccount className="h-full" color="inherit" />
            <div>{user ? <span className="text-[#fcd890]">Premium</span> : 'Free'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
