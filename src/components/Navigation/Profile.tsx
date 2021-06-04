import Avatar from './Avatar';
import LoginButton from '../Login/LoginButton';
import { useAuth, useLibrary } from '../../contexts';
import { VscLibrary, VscFileMedia, VscAccount } from 'react-icons/vsc';

export default function Profile() {
  const { user } = useAuth();
  const { libraries } = useLibrary();
  return (
    <div className="flex flex-row flex-wrap justify-center items-center gap-y-1">
      <div>
        <Avatar />
        <div className="font-medium text-lg mt-1">{user ? user.displayName : 'Anonymous'}</div>
      </div>
      <div className="flex flex-col items-center gap-y-2">
        <LoginButton />
        <div className="flex flex-row justify-items-center gap-2 h-12">
          <div className="profile-stat">
            <VscLibrary className="h-full" />
            <div>{libraries.length}</div>
          </div>
          <div className="w-[1px] bg-gray-300"></div>
          <div className="profile-stat">
            <VscFileMedia className="h-full" />
            <div>{libraries.reduce((count, lib) => count + lib.image_count, 0)}</div>
          </div>
          <div className="w-[1px] bg-gray-300"></div>
          <div className="profile-stat">
            <VscAccount className="h-full" />
            <div>Premium</div>
          </div>
        </div>
      </div>
    </div>
  );
}
