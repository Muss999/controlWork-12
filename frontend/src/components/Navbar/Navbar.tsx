import { Link } from "react-router-dom";
import NoAuthNavbar from "./NoAuthNavbar";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/users/usersSlice";
import AuthNavbar from "./AuthNavbar";
import { API_URL } from "../../constants";

const Navbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <nav className="navbar bg-secondary mb-3" data-bs-theme="dark">
      <div className="container d-f justify-content-between">
        <Link to={"/"} className="navbar-brand">
          Recipe Book
        </Link>
        <div className="d-flex gap-3">
          {user ? <AuthNavbar user={user} /> : <NoAuthNavbar />}
          {user?.avatar && (
            <div>
              {user.avatar === null ? null : (
                <img
                  src={
                    user.avatar.startsWith("https")
                      ? `${user.avatar}`
                      : API_URL + "/" + user.avatar
                  }
                  style={{
                    minWidth: "40px",
                    maxWidth: "40px",
                    maxHeight: "40px",
                    minHeight: "40px",
                    borderRadius: "50%",
                  }}
                  alt={user.avatar}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
