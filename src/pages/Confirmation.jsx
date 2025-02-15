import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBooking } from "../features/mybookings/bookedSlice";
import { InputField, Button, Loader, Navbar } from "../components/index";
import {
  clearBookings,
  setTempBooking,
} from "../features/bookings/bookingsSlice";
import styles from "../style";
import { saveBooking } from "../utils/saveBooking";
import { supabase } from '../lib/supabase';

const Confirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const user = useSelector((state) => state.auth.user) || null;

  // Initialize form data
  const [formData, setFormData] = useState({
    vehicleNumber: user?.vehicleNumber || "",
    email: user?.email || "",
  });
  
  const [errors, setErrors] = useState({});

  const {
    singlePark,
    userLocation,
    distance,
    duration,
    bookingsDetails,
    selectedSlot,
  } = useSelector((state) => state.bookings);

  // Auto-fill only if formData is empty
  useEffect(() => {
    if (user && !formData.vehicleNumber) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        vehicleNumber: user.vehicleNumber || "",
      }));
    }
  }, [user]); // Only run when user data changes

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleNumber) newErrors.vehicleNumber = "Vehicle number is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Parse the time range
      if (!bookingsDetails.timeRange) {
        throw new Error('Time range is required');
      }

      const [startTime, endTime] = bookingsDetails.timeRange.split('-').map(t => t.trim());
      
      // Validate time format (24-hour format)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        throw new Error('Invalid time format. Please use HH:MM format (24-hour)');
      }

      // Create a Date object for the booking date
      if (!bookingsDetails.date) {
        throw new Error('Booking date is required');
      }
      const bookingDate = new Date(bookingsDetails.date);
      if (isNaN(bookingDate.getTime())) {
        throw new Error('Invalid date format');
      }

      // Create timestamps for start and end times
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);

      // Create date objects with the correct time
      const startDateTime = new Date(bookingDate);
      const endDateTime = new Date(bookingDate);

      // Set hours directly without UTC conversion
      startDateTime.setHours(startHours, startMinutes, 0, 0);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      // Debug log
      console.log('Time components:', {
        bookingDate: bookingDate.toISOString(),
        requestedTime: {
          start: `${startHours}:${startMinutes}`,
          end: `${endHours}:${endMinutes}`
        },
        actualTime: {
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          startHours: startDateTime.getHours(),
          endHours: endDateTime.getHours()
        }
      });

      // Validate that end time is after start time
      if (endDateTime <= startDateTime) {
        throw new Error('End time must be after start time');
      }

      const bookingData = {
        slot_id: selectedSlot.id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        vehicle_number: formData.vehicleNumber,
      };

      // Debug log to verify the data
      console.log('Booking Data to be saved:', bookingData);

      const savedBooking = await saveBooking(bookingData);
      
      const bookingForRedux = {
        ...savedBooking,
        park: singlePark,
        userName: user ? user.name : "",
        email: formData.email,
      };

      dispatch(addBooking(bookingForRedux));
      dispatch(clearBookings());
      navigate("/mybookings");
    } catch (error) {
      console.error('Error saving booking:', error);
      alert(`Failed to save booking: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    dispatch(clearBookings());
    navigate("/");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="w-full bg-[#2C3E50]">
        <div className="w-full">
          <Navbar />
        </div>
      </div>

      <div className={`${styles.flexCenter} h-[calc(100vh-64px)]`}>
        <div className="bg-[#2C3E50] p-6 rounded-lg max-w-2xl w-[90%] md:w-full shadow-lg">
          <h2 className="text-2xl text-center text-white mb-6 font-bold font-poppins">
            Confirm Your Booking
          </h2>

          <div className="space-y-6">
            {/* User Details Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Email:
                </label>
                <InputField
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                  disabled={user}
                />
                {errors.email && (
                  <div className="text-red-400 mt-1 text-sm">{errors.email}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Vehicle Number:
                </label>
                <InputField
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your vehicle number"
                />
                {errors.vehicleNumber && (
                  <div className="text-red-400 mt-1 text-sm">{errors.vehicleNumber}</div>
                )}
              </div>
            </div>

            {/* Booking Details Section */}
            <div className="bg-[#34495E] p-4 rounded-lg space-y-3">
              <h3 className="text-white font-semibold mb-4">Booking Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Location</p>
                  <p className="text-white font-medium">{singlePark.name}</p>
                </div>
                
                <div>
                  <p className="text-gray-400">Date</p>
                  <p className="text-white font-medium">{bookingsDetails.date}</p>
                </div>
                
                <div>
                  <p className="text-gray-400">Time</p>
                  <p className="text-white font-medium">{bookingsDetails.timeRange}</p>
                </div>
                
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-white font-medium">{bookingsDetails.duration} hour(s)</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-xl font-bold text-white">
                    ₹{singlePark.price_per_hour * bookingsDetails.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <Button 
                onClick={handleCancel} 
                type="button"
                className="px-6 py-2 bg-[#DC3545] hover:bg-[#C82333] text-white rounded-lg transition-colors"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                type="button"
                className="px-6 py-2 bg-[#28A745] hover:bg-[#218838] text-white rounded-lg transition-colors"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
