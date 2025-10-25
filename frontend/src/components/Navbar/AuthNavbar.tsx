import { Link } from "react-router-dom";
import type { IUser } from "../../types";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/users/usersThunk";

interface Props {
  user: IUser;
}
const AuthNavbar = ({ user }: Props) => {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
  };
  return (
    <>
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          My profile
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <div className="dropdown-header">User: {user.displayName}</div>
          </li>
          <li>
            <Link className="dropdown-item" to={"/"} onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AuthNavbar;
