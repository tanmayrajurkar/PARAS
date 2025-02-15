import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { close, logo, menu } from "../../assets";
import { navLinks } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/authentication/authUserSlice";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "../../services/supabase";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await signOut(); // Call Supabase signOut
      dispatch(logout()); // Dispatch Redux action
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavClick = () => {
    // Close mobile menu when any element is clicked
    if (window.innerWidth < 1024) {
      setToggle(false);
    }
  };

  return (
    <nav className="w-full flex py-4 justify-between items-center shadow-md">
      <Link to="/">
        <img src={logo} alt="ParkEase" className="w-[40px] ml-6" />
      </Link>

      {/* Main Navigation Links */}
      <ul className="list-none lg:flex hidden items-center flex-1 ml-10">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              index === navLinks.length - 1 ? "mr-0" : "mr-10"
            }`}
          >
            <NavLink
              to={nav.url}
              className={({ isActive }) =>
                isActive
                  ? "text-white font-poppins font-bold px-4 py-2 bg-[#34495E] rounded-md transition-all"
                  : "text-gray-300 hover:text-white transition-colors"
              }
            >
              {nav.title}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Auth Section */}
      <div className="hidden lg:flex items-center mr-6">
        {user ? (
          <div className="flex items-center gap-x-6">
            <span className="text-gray-300">Hello! {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FaSignOutAlt size={24} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-x-4">
            <Link
              to="/login"
              className="text-gray-300 bg-[#34495E] hover:text-white px-4 py-2 rounded-md transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-[#2C3E50] text-white px-4 py-2 rounded-md hover:bg-[#34495E] transition-colors"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden flex flex-1 justify-end items-center mr-6">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain filter invert"
          onClick={(e) => {
            e.stopPropagation(); // Prevent immediate closure when clicking the toggle button
            setToggle((prev) => !prev);
          }}
        />
        <div
          className={`${
            toggle ? "flex" : "hidden"
          } p-6 bg-[#34495E] absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl shadow-xl z-50`}
          onClick={handleNavClick}
        >
          <ul className="list-none flex flex-col justify-end items-center flex-1">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-normal cursor-pointer text-[16px] ${
                  index === navLinks.length - 1 ? "mb-4" : "mb-4"
                }`}
              >
                <NavLink
                  to={nav.url}
                  className={({ isActive }) =>
                    isActive
                      ? "text-white font-poppins font-bold px-4 py-2 bg-[#2C3E50] rounded-md"
                      : "text-gray-300 hover:text-white transition-colors"
                  }
                >
                  {nav.title}
                </NavLink>
              </li>
            ))}
            {/* Mobile Auth Links */}
            {user ? (
              <>
                <li className="text-gray-300 mb-4">Hello, {user.name}</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <FaSignOutAlt size={24} />
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="mb-4">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
