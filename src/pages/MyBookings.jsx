import { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import { Loader } from "../components";
import { FaClock, FaCar, FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [pointsToConvert, setPointsToConvert] = useState('');
  const [conversionError, setConversionError] = useState('');
  const [convertedCash, setConvertedCash] = useState(0);
  const [conversionMessage, setConversionMessage] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!user) {
          setError('No authenticated user found');
          return;
        }

        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            parking_slots (
              slot_number,
              basement_number,
              it_parks (
                name,
                address,
                price_per_hour
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        setBookings(bookingsData || []);
        // Calculate total reward points (50 points per booking)
        setRewardPoints((bookingsData || []).length * 50);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleConvertPoints = () => {
    const points = parseInt(pointsToConvert, 10);
    if (isNaN(points) || points <= 0 || points > rewardPoints) {
      setConversionError('Invalid points to convert');
      setConversionMessage('');
      return;
    }
    
    if (points < 100) {
      setConversionError('Minimum points required: 100');
      setConversionMessage('');
      return;
    }
    
    const cashEquivalent = Math.floor(points / 10);
    setConvertedCash(cashEquivalent);
    setRewardPoints(rewardPoints - points);
    setPointsToConvert('');
    setConversionError('');
    setConversionMessage(`You have converted ${points} points to ₹${cashEquivalent}.`);
  };

  // Calculate duration between start and end time
  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = (endTime - startTime) / (1000 * 60 * 60); // Convert to hours
    return Math.round(duration * 10) / 10; // Round to 1 decimal place
  };

  // Calculate total price
  const calculatePrice = (start, end, pricePerHour) => {
    const duration = calculateDuration(start, end);
    return Math.round(duration * pricePerHour);
  };

  const handleRedeemPoints = (requiredPoints, rewardDescription) => {
    console.log(`Attempting to redeem: ${rewardDescription} with ${requiredPoints} points`);
    if (rewardPoints >= requiredPoints) {
      const redemptionCode = `CODE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setConversionMessage(`Redeemed ${rewardDescription}! Your code: ${redemptionCode}`);
      setRewardPoints(rewardPoints - requiredPoints);
      setConversionError('');
      console.log(`Redemption successful: ${redemptionCode}`);
    } else {
      setConversionError(`You need ${requiredPoints - rewardPoints} more points to redeem ${rewardDescription}.`);
      setConversionMessage('');
      console.log('Redemption failed: Not enough points');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2a3a] to-[#2C3E50]">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">My Bookings</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-300 text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-gray-200 border-opacity-20 hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {booking.parking_slots?.it_parks?.name}
                  </h3>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    booking.booking_status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {booking.booking_status}
                  </span>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-blue-400" />
                    <span>{booking.parking_slots?.it_parks?.address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaCar className="text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Vehicle & Slot</p>
                      <p>{booking.vehicle_number} | {booking.parking_slots?.basement_number}-{booking.parking_slots?.slot_number}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaClock className="text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Duration</p>
                      <p>{calculateDuration(booking.start_time, booking.end_time)} hours</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaRegCalendarAlt className="text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Timing</p>
                      <p>{new Date(booking.start_time).toLocaleString()} - </p>
                      <p>{new Date(booking.end_time).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Amount</span>
                      <span className="text-2xl font-bold text-white">
                        ₹{calculatePrice(
                          booking.start_time, 
                          booking.end_time, 
                          booking.parking_slots?.it_parks?.price_per_hour
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Reward Points</h3>
          <p className="text-gray-300 mb-4">Total Reward Points: <span className="font-bold">{rewardPoints}</span></p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => handleRedeemPoints(5000, '1 free booking')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
              disabled={rewardPoints < 5000}
            >
              Redeem 5000 points - 1 Free Booking
            </button>
            <button
              onClick={() => handleRedeemPoints(3000, '50% off')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
              disabled={rewardPoints < 3000}
            >
              Redeem 3000 points - 50% Off on Next Booking
            </button>
            <button
              onClick={() => handleRedeemPoints(2000, '20% off')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
              disabled={rewardPoints < 2000}
            >
              Redeem 2000 points - 20% Off on Next Booking
            </button>
          </div>

          {conversionError && <p className="text-red-500 mt-2">{conversionError}</p>}
          {conversionMessage && <p className="text-green-500 mt-2">{conversionMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
