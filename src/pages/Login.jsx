import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button, InputField, Loader, Navbar } from "../components";
import styles from "../style";
import { addBooking } from "../features/mybookings/bookedSlice";
import { clearBookings } from "../features/bookings/bookingsSlice";
import { loginUser, guestLoginUser } from "../features/authentication/authUserSlice";
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [loading, setLoading] = useState(false);
  const { tempBooking } = useSelector((state) => state.bookings);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        handleBookingResponse(resultAction.payload.foundUser._id);
      } else if (loginUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Login failed');
      }
    } catch (error) {
      setErrors({ login: error.message });
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(guestLoginUser());
      if (guestLoginUser.fulfilled.match(resultAction)) {
        handleBookingResponse(resultAction.payload.foundUser._id);
      } else if (guestLoginUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Guest login failed');
      }
    } catch (error) {
      setErrors({ login: error.message });
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingResponse = (userId) => {
    if (tempBooking) {
      const bookingData = { ...tempBooking, userId };
      dispatch(addBooking(bookingData));
      dispatch(clearBookings());
      navigate("/mybookings");
    } else {
      navigate(from);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="w-full bg-[#2C3E50]">
          <div className="w-full">
            <Navbar />
          </div>
        </div>
      <div className={`${styles.flexCenter} h-[calc(100vh-64px)]`}>
        <div className="bg-[#2C3E50] p-6 rounded-lg max-w-md w-[90%] md:w-full shadow-lg">
          <h2 className="text-2xl text-center text-white mb-6 font-bold font-poppins">
            Login
          </h2>
          {errors.login && <div className="error-message mb-4">{errors.login}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email:
              </label>
              <InputField
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter your email"
              />
              {errors.email && <div className="text-red-400 mt-1 text-sm">{errors.email}</div>}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password:
              </label>
              <InputField
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter your password"
              />
              {errors.password && <div className="text-red-400 mt-1 text-sm">{errors.password}</div>}
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full bg-[#28A745] hover:bg-[#218838] text-white py-2 rounded-lg transition-colors">
                Login
              </Button>
              <Button
                type="button"
                onClick={handleGuestLogin}
                className="w-full bg-[#007BFF] hover:bg-[#0056D2] text-white py-2 rounded-lg transition-colors"
              >
                GUEST USER
              </Button>
            </div>
          </form>

          <p className="text-center mt-6 text-gray-300">
            Missing out amazing Experience?{" "}
            <Link to="/register" className="text-[#007BFF] hover:text-[#0056D2] font-medium transition-colors">
              register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
