import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, InputField } from "../index";
import { setBookingDetails } from "../../features/bookings/bookingsSlice";
import { useCheckAvailability } from "../../hooks";
import { toast } from "react-toastify";

const BookingFilters = ({ singlePark }) => {
  const dispatch = useDispatch();
  const checkAvailability = useCheckAvailability();

  // Get current date and max date (12 hours from now)
  const now = new Date();
  const maxDate = new Date(now.getTime() + (12 * 60 * 60 * 1000));
  
  // Format dates for input min/max attributes
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    date: formatDateForInput(now),
    hour: now.getHours().toString(),
    duration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Additional validation for date selection
    if (name === 'date') {
      const selectedDate = new Date(value);
      if (selectedDate > maxDate) {
        toast.error('Please select a date within the next 12 hours');
        return;
      }
    }

    // Additional validation for hour selection
    if (name === 'hour') {
      const selectedDateTime = new Date(formData.date);
      selectedDateTime.setHours(parseInt(value), 0, 0, 0);
      
      if (selectedDateTime < now || selectedDateTime > maxDate) {
        toast.error('Please select a time within the next 12 hours');
        return;
      }
    }

    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
  };

  const validateForm = () => {
    const { date, hour, duration } = formData;
    if (!date || !hour || !duration) {
      toast.error("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Calculate time range
      const startHour = parseInt(formData.hour);
      const endHour = startHour + parseInt(formData.duration);
      
      // Format hours for display
      const formatHour = (hour) => {
        const h = hour % 24;
        return h < 10 ? `0${h}:00` : `${h}:00`;
      };

      const timeRange = `${formatHour(startHour)} - ${formatHour(endHour)}`;

      // Dispatch booking details with time range
      dispatch(setBookingDetails({
        ...formData,
        timeRange
      }));
      
      await checkAvailability();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Error processing booking");
    }
  };

  // Add this function to generate available time slots
  const generateTimeSlots = () => {
    const selectedDate = new Date(formData.date);
    const slots = [];
    
    // Set the selected date to the current time for proper comparison
    selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    
    for (let hour = 0; hour < 24; hour++) {
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hour, 0, 0, 0);
      
      // Only include future slots within the next 12 hours
      if (slotTime >= now && slotTime <= maxDate) {
        console.log('Adding slot:', hour, slotTime); // Debug log
        slots.push(hour);
      }
    }
    console.log('Generated slots:', slots); // Debug log
    return slots;
  };

  // Add useEffect to reset hour when date changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      hour: "" // Reset hour when date changes
    }));
  }, [formData.date]);

  return (
    <form
      onSubmit={handleBooking}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <div>
        <label className="block text-gray-700 mb-2">Select Date</label>
        <InputField
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={formatDateForInput(now)}
          max={formatDateForInput(maxDate)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Select Hour</label>
        <select
          name="hour"
          value={formData.hour}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Hour</option>
          {generateTimeSlots().map((hour) => (
            <option key={hour} value={hour}>
              {hour < 10 ? `0${hour}:00` : `${hour}:00`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Select Duration (hours)</label>
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Duration</option>
          {[1, 2, 3, 4, 5, 6].map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full">
        Check Availability
      </Button>
    </form>
  );
};

export default BookingFilters;
