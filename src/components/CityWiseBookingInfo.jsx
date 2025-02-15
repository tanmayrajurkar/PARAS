import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchBookingsByCity } from '../services/supabase';

const CityWiseBookingInfo = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const { userCity } = useSelector((state) => state.bookings);

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchBookingsByCity(userCity);
      setBookings(data);
    };

    loadBookings();
  }, [userCity]);

  useEffect(() => {
    setFilteredBookings(
      bookings.filter((booking) =>
        booking.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, bookings]);

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Bookings in {userCity}</h2>
      <input
        type="text"
        placeholder="Search by number plate"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 rounded"
      />
      <table className="min-w-full bg-gray-700">
        <thead>
          <tr>
            <th className="p-4">Vehicle Number</th>
            <th className="p-4">Parking Lot</th>
            <th className="p-4">Start Time</th>
            <th className="p-4">End Time</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="p-4">{booking.vehicle_number}</td>
                <td className="p-4">{booking.parking_slots.it_parks.name}</td>
                <td className="p-4">{new Date(booking.start_time).toLocaleString()}</td>
                <td className="p-4">{new Date(booking.end_time).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded ${booking.booking_status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}>
                    {booking.booking_status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center">No bookings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CityWiseBookingInfo; 