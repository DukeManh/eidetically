import { useAuth } from '../../contexts';

export default function LoginButton() {
  const { setLoginVisible, loginVisible, user, logout } = useAuth();

  return (
    <>
      {!user ? (
        <button className="loginButton" onClick={() => setLoginVisible(!loginVisible)}>
          Sign in
        </button>
      ) : (
        <button className="loginButton" onClick={logout}>
          Sign out
        </button>
      )}
    </>
  );
}
