import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const BookingsDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const { data, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            slot_id (
              id,
              slot_number,
              park_id (
                id,
                name,
                address,
                latitude,
                longitude
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        setBookings(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleSort = (field) => {
    const newDirection = 
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const getFilteredBookings = () => {
    return bookings.filter(booking => 
      booking.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.slot_id?.park_id?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.slot_id?.park_id?.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getSortedBookings = () => {
    const filteredData = getFilteredBookings();
    const sortedData = [...filteredData].sort((a, b) => {
      let compareA, compareB;

      switch (sortField) {
        case 'slot_number':
          compareA = a.slot_id?.slot_number || '';
          compareB = b.slot_id?.slot_number || '';
          break;
        case 'park_name':
          compareA = a.slot_id?.park_id?.name || '';
          compareB = b.slot_id?.park_id?.name || '';
          break;
        case 'address':
          compareA = a.slot_id?.park_id?.address || '';
          compareB = b.slot_id?.park_id?.address || '';
          break;
        case 'coordinates':
          compareA = `${a.slot_id?.park_id?.latitude || ''}${a.slot_id?.park_id?.longitude || ''}`;
          compareB = `${b.slot_id?.park_id?.latitude || ''}${b.slot_id?.park_id?.longitude || ''}`;
          break;
        case 'start_time':
          compareA = new Date(a.start_time).getTime();
          compareB = new Date(b.start_time).getTime();
          break;
        case 'end_time':
          compareA = new Date(a.end_time).getTime();
          compareB = new Date(b.end_time).getTime();
          break;
        case 'vehicle_number':
          compareA = a.vehicle_number || '';
          compareB = b.vehicle_number || '';
          break;
        case 'status':
          compareA = a.booking_status || '';
          compareB = b.booking_status || '';
          break;
        default:
          return 0;
      }

      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sortedData;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Bookings</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Vehicle Number, Park Name or Address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            {[
              { id: 'slot_number', label: 'Parking Slot' },
              { id: 'park_name', label: 'Parking Name' },
              { id: 'address', label: 'Address' },
              { id: 'coordinates', label: 'Coordinates' },
              { id: 'start_time', label: 'Start Time' },
              { id: 'end_time', label: 'End Time' },
              { id: 'vehicle_number', label: 'Vehicle Number' },
              { id: 'status', label: 'Status' }
            ].map(({ id, label }) => (
              <th key={id} className="border-b border-gray-200">
                <button
                  onClick={() => handleSort(id)}
                  className={`w-full px-4 py-3 text-left text-sm font-semibold text-gray-600 
                    bg-gray-200
                    group flex items-center justify-between`}
                >
                  <span>{label}</span>
                  <span className={`ml-2 transform transition-transform duration-200
                    ${sortField === id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    {sortField === id 
                      ? (sortDirection === 'asc' ? '↑' : '↓')
                      : '↕'}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getSortedBookings().map((booking, index) => (
            <tr 
              key={booking.id}
              className={`
                hover:bg-gray-50 transition-colors duration-150 ease-in-out
                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              `}
            >
              <td className="border-b border-gray-200 px-4 py-3">{booking.slot_id?.slot_number || 'N/A'}</td>
              <td className="border-b border-gray-200 px-4 py-3">{booking.slot_id?.park_id?.name || 'N/A'}</td>
              <td className="border-b border-gray-200 px-4 py-3">{booking.slot_id?.park_id?.address || 'N/A'}</td>
              <td className="border-b border-gray-200 px-4 py-3">
                {booking.slot_id?.park_id?.latitude && booking.slot_id?.park_id?.longitude
                  ? `${booking.slot_id.park_id.latitude}, ${booking.slot_id.park_id.longitude}`
                  : 'N/A'}
              </td>
              <td className="border-b border-gray-200 px-4 py-3">{new Date(booking.start_time).toLocaleString()}</td>
              <td className="border-b border-gray-200 px-4 py-3">{new Date(booking.end_time).toLocaleString()}</td>
              <td className="border-b border-gray-200 px-4 py-3">{booking.vehicle_number}</td>
              <td className="border-b border-gray-200 px-4 py-3 text-center">
                <div className="flex items-center justify-center">
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-200 
                      ${booking.booking_status === 'active' 
                        ? 'bg-green-500 shadow-lg shadow-green-200 ring-4 ring-green-200 ring-opacity-50' 
                        : 'bg-red-500 shadow-lg shadow-red-200 ring-4 ring-red-200 ring-opacity-50'
                      }`}
                    title={booking.booking_status}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsDashboard; 