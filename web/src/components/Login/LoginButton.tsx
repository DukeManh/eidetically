import PopConfirm from '../PopConfirm';
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
        <PopConfirm
          content="Are you sure to end the session?"
          placement="top"
          onConfirm={logout}
          cancelText="Cancel"
          confirmText="Logout"
        >
          <button className="loginButton" type="button">
            Sign out
          </button>
        </PopConfirm>
      )}
    </>
  );
}
