import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, InputField, Loader, Navbar } from "../components";
import { signUp } from "../services/supabase";
import styles from "../style";
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    vehicleNumber: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.vehicleNumber) newErrors.vehicleNumber = "Vehicle number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(formData);
      toast.success("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (error) {
      setErrors({ register: error.message });
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            Register
          </h2>
          {errors.register && <div className="error-message mb-4">{errors.register}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 mb-2">Name:</label>
              <InputField
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter your name"
              />
              {errors.name && <div className="text-red-400 mt-1 text-sm">{errors.name}</div>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">Email:</label>
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
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-300 mb-2">Password:</label>
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

            <div className="mb-4">
              <label htmlFor="vehicleNumber" className="block text-gray-300 mb-2">Vehicle Number:</label>
              <InputField
                type="text"
                name="vehicleNumber"
                id="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter your vehicle number"
              />
              {errors.vehicleNumber && <div className="text-red-400 mt-1 text-sm">{errors.vehicleNumber}</div>}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button type="submit" className="w-full bg-[#28A745] hover:bg-[#218838] text-white py-2 rounded-lg transition-colors">
                Register
              </Button>
            </div>
          </form>
          
          <p className="text-center mt-6 text-gray-300">
            Already a Family?{" "}
            <Link to="/login" className="text-[#007BFF] hover:text-[#0056D2] font-medium transition-colors">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
