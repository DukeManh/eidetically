import { auth } from '../../server/firebase';

export default function Welcome() {
  const { currentUser: user } = auth;
  return (
    <div className="flex-grow overflow-y-auto min-h-0 pt-6 px-4 pb-16">
      <div>Hey Welcome {user?.displayName}</div>
    </div>
  );
}
