import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parkingLots, setParkingLots] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'all', // all, today, week, month
    status: 'all', // all, active, completed
    parkingLot: 'all'
  });

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          vehicle_number,
          booking_status,
          user_id,
          slot_id,
          parking_slots!inner (
            slot_number,
            basement_number,
            it_parks!inner (
              id,
              name,
              profile_id
            )
          )
        `)
        .eq('parking_slots.it_parks.profile_id', user.id);

      // Apply filters
      if (filters.dateRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        }
        
        query = query.gte('start_time', startDate.toISOString());
      }

      if (filters.status !== 'all') {
        query = query.eq('booking_status', filters.status);
      }

      if (filters.parkingLot !== 'all') {
        query = query.eq('parking_slots.it_parks.id', filters.parkingLot);
      }

      // Get bookings data
      const { data: bookingsData, error: bookingsError } = await query.order('start_time', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch profiles data for each booking
      const userIds = bookingsData.map(booking => booking.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine bookings with profiles data
      const combinedData = bookingsData.map(booking => ({
        ...booking,
        profile: profilesData.find(profile => profile.id === booking.user_id)
      }));

      // Remove duplicates from parking lots
      const uniqueParkingLots = Array.from(new Set(combinedData.map(
        booking => booking.parking_slots.it_parks.id
      ))).map(id => {
        const booking = combinedData.find(b => b.parking_slots.it_parks.id === id);
        return {
          id: booking.parking_slots.it_parks.id,
          name: booking.parking_slots.it_parks.name
        };
      });

      setParkingLots(uniqueParkingLots);
      setBookings(combinedData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-[#34495E] p-4 rounded-lg flex flex-wrap gap-4">
        <select
          className="bg-[#2C3E50] text-white px-4 py-2 rounded"
          value={filters.dateRange}
          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>

        <select
          className="bg-[#2C3E50] text-white px-4 py-2 rounded"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="bg-[#2C3E50] text-white px-4 py-2 rounded"
          value={filters.parkingLot}
          onChange={(e) => setFilters(prev => ({ ...prev, parkingLot: e.target.value }))}
        >
          <option value="all">All Parking Lots</option>
          {parkingLots.map(lot => (
            <option key={lot.id} value={lot.id}>{lot.name}</option>
          ))}
        </select>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-[#34495E]">
            <tr>
              <th className="p-4 text-left">Parking Lot</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Vehicle</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Start Time</th>
              <th className="p-4 text-left">End Time</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#34495E]">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-[#2C3E50]">
                <td className="p-4">{booking.parking_slots.it_parks.name}</td>
                <td className="p-4">
                  Basement {booking.parking_slots.basement_number}, 
                  Slot {booking.parking_slots.slot_number}
                </td>
                <td className="p-4">{booking.vehicle_number}</td>
                <td className="p-4">{booking.profile?.full_name || 'N/A'}</td>
                <td className="p-4">
                  {booking.profile?.phone_number || 'N/A'}<br/>
                  <span className="text-sm text-gray-400">{booking.profile?.email || 'N/A'}</span>
                </td>
                <td className="p-4">{formatDate(booking.start_time)}</td>
                <td className="p-4">{formatDate(booking.end_time)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    booking.booking_status === 'active' 
                      ? 'bg-green-500' 
                      : 'bg-gray-500'
                  }`}>
                    {booking.booking_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No bookings found for the selected filters
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory; 