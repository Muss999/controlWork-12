import { Link } from "react-router-dom";

const NoAuthNavbar = () => {
    return (
        <>
            <Link to={"/register"} className="nav-link text-white">
                Sign Up
            </Link>
            <Link to={"/login"} className="nav-link text-white">
                Sign In
            </Link>
        </>
    );
};

export default NoAuthNavbar;
