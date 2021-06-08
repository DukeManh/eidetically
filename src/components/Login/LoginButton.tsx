import { useAuth } from '../../contexts';

export default function LoginButton() {
  const { setLoginVisible, loginVisible, user, logout } = useAuth();

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
          onClick={logout}
        >
          Sign out
        </button>
      )}
    </div>
  );
}
