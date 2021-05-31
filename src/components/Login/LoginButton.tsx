import { auth } from '../../server/firebase';
import { useAuth } from '../../contexts';

export default function LoginButton() {
  const { user } = useAuth();
  const { setLoginVisible, loginVisible } = useAuth();

  return (
    <div>
      {!user ? (
        <button
          className="px-4 py-1 bg-primary opacity-70 hover:opacity-100 active:bg-black"
          onClick={() => setLoginVisible(!loginVisible)}
        >
          Sign in
        </button>
      ) : (
        <button
          className="px-4 py-1 bg-primary opacity-70 hover:opacity-100 active:bg-black"
          onClick={() => auth.signOut()}
        >
          Sign out
        </button>
      )}
    </div>
  );
}
