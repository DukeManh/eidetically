import { MdEdit } from 'react-icons/md';

import { useAuth } from '../../contexts';
import defaultAvatar from '../../public/images/default-avatar.png';

export default function Avatar() {
  const { user } = useAuth();

  return (
    <figure className="w-max mx-auto relative">
      <img
        src={user?.photoURL || defaultAvatar}
        alt={`${user?.displayName || 'default user'}'s profile avatar`}
        width={96}
        height={96}
        className="mx-auto rounded-full border border-gray-500 shadow-lg"
      ></img>
      {user && (
        <>
          <div className="rounded-full bg-white border border-black w-6 h-6 p-[2px] absolute bottom-0 right-0 z-[5]">
            <MdEdit style={{ fill: 'black', height: '100%', width: '100%' }} />
          </div>
          <div className="absolute opacity-0 hover:opacity-100 p-[1px] top-0 left-0 rounded-full w-full h-full bg-mask transition-all">
            <button className="h-full w-full text-gray-200 outline-none">Edit Profile</button>
          </div>
        </>
      )}
    </figure>
  );
}
