import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../api/store";
import { clearTokens } from "../api/authSlice";
import icon from "../assets/icon.svg";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.auth.accessToken
  );

  const handleLogout = () => {
    dispatch(clearTokens());
    // You can also navigate to the login page after logout if needed
    navigate("/login");
  };

  return (
    <nav className="w-full absolute bg-blue-600 p-4 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold flex items-center space-x-2">
          <img src={icon} className="h-12 w-12 rounded-full" />
          <span>Taskier</span>
        </div>
        <ul className="flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`text-white hover:bg-blue-700 px-3 py-2 rounded ${
                    location.pathname === "/dashboard" ? "bg-blue-700" : ""
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`text-white hover:bg-blue-700 px-3 py-2 rounded ${
                    location.pathname === "/login" ? "bg-blue-700" : ""
                  }`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`text-white hover:bg-blue-700 px-3 py-2 rounded ${
                    location.pathname === "/register" ? "bg-blue-700" : ""
                  }`}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
