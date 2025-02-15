import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { fetchBookingStatistics } from '../services/supabase';

const processBookingData = (data, timeFrame) => {
  if (!data || data.length === 0) {
    console.log('No booking data available');
    return [];
  }

  const groupedData = data.reduce((acc, booking) => {
    if (!booking.parking_slots?.it_parks) {
      console.log('Skipping booking with missing park data:', booking);
      return acc;
    }

    const park = booking.parking_slots.it_parks;
    const date = new Date(booking.created_at);
    
    // Format date based on timeframe
    const dateKey = format(date, 
      timeFrame === 'day' ? 'HH:00' :  // Show hourly for day view
      timeFrame === 'week' ? 'EEE' :    // Show daily for week view
      `MMM 'Week' w`                    // Show "Month Week N" format
    );

    if (!acc[park.id]) {
      acc[park.id] = {
        name: park.name,
        bookings: {},
        dailyRevenue: {},
      };
    }

    // Initialize or increment bookings
    acc[park.id].bookings[dateKey] = (acc[park.id].bookings[dateKey] || 0) + 1;
    
    // Track revenue per time period
    const revenueKey = dateKey;
    if (!acc[park.id].dailyRevenue[revenueKey]) {
      acc[park.id].dailyRevenue[revenueKey] = 0;
    }
    acc[park.id].dailyRevenue[revenueKey] += Number(park.price_per_hour) || 0;

    return acc;
  }, {});

  // Sort the data points based on timeframe
  const processedData = Object.entries(groupedData).map(([parkId, { name, bookings, dailyRevenue }]) => {
    let sortedEntries;
    
    if (timeFrame === 'day') {
      // For day view, sort by hour (00-23)
      sortedEntries = Object.entries(bookings).sort((a, b) => {
        return parseInt(a[0]) - parseInt(b[0]);
      });
    } else if (timeFrame === 'week') {
      // For week view, sort by day of week
      const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      sortedEntries = Object.entries(bookings).sort((a, b) => {
        return dayOrder.indexOf(a[0]) - dayOrder.indexOf(b[0]);
      });
    } else {
      // For month view, sort by week number while preserving the formatted date
      sortedEntries = Object.entries(bookings).sort((a, b) => {
        const weekA = parseInt(a[0].match(/Week (\d+)/)[1]);
        const weekB = parseInt(b[0].match(/Week (\d+)/)[1]);
        return weekA - weekB;
      });
    }

    return {
      parkId,
      name,
      data: sortedEntries.map(([date, count]) => ({
        date,
        bookings: count,
        revenue: dailyRevenue[date].toFixed(2),
      })),
    };
  });

  console.log('Processed booking data:', processedData);
  return processedData;
};

const ParkingStatistics = () => {
  const [timeFrame, setTimeFrame] = useState('day');
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBookingStatistics(timeFrame);
        const processedData = processBookingData(data, timeFrame);
        setBookingData(processedData);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame]);

  const calculateDomain = (data, key) => {
    if (!data || data.length === 0) return [0, 10];
    
    const values = data.map(item => Number(item[key]));
    const max = Math.max(...values);
    const min = Math.min(...values);
    const padding = (max - min) * 0.1; // Add 10% padding
    
    return [
      Math.floor(Math.max(0, min - padding)), // Don't go below 0
      Math.ceil(max + padding)
    ];
  };

  return (
    <div className="bg-[#2C3E50] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl text-white font-semibold">
          {timeFrame === 'day' ? 'Hourly' : 
           timeFrame === 'week' ? 'Daily' : 
           'Weekly'} Booking Statistics
        </h3>
        <div className="space-x-2">
          {['day', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeFrame(period)}
              className={`px-4 py-2 rounded ${
                timeFrame === period
                  ? 'bg-[#3498DB] text-white'
                  : 'bg-[#34495E] text-gray-300 hover:bg-[#3498DB] hover:text-white'
              }`}
            >
              {period === 'day' ? 'Hourly' :
               period === 'week' ? 'Daily' :
               'Weekly'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-white text-center py-20">Loading...</div>
      ) : (
        bookingData.map(({ parkId, name, data }) => {
          const bookingsDomain = calculateDomain(data, 'bookings');
          const revenueDomain = calculateDomain(data, 'revenue');
          
          return (
            <div key={parkId} className="mb-8">
              <h4 className="text-lg text-white font-semibold mb-4">{name}</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#fff" 
                    tick={{ fill: '#fff' }}
                    label={{ 
                      value: timeFrame === 'day' ? 'Hours' : 
                             timeFrame === 'week' ? 'Days' : 
                             'Weeks',
                      position: 'insideBottom',
                      offset: -5,
                      fill: '#fff'
                    }}
                  />
                  <YAxis 
                    yAxisId="bookings"
                    stroke="#3498DB"
                    tick={{ fill: '#fff' }}
                    domain={bookingsDomain}
                    label={{ 
                      value: 'Bookings',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#3498DB',
                      offset: 10
                    }}
                  />
                  <YAxis 
                    yAxisId="revenue"
                    orientation="right"
                    stroke="#E74C3C"
                    tick={{ fill: '#fff' }}
                    domain={revenueDomain}
                    label={{ 
                      value: 'Revenue (₹)',
                      angle: 90,
                      position: 'insideRight',
                      fill: '#E74C3C',
                      offset: 10
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#34495E',
                      border: 'none',
                      color: '#fff',
                    }}
                    formatter={(value, name) => [
                      name === 'revenue' ? `₹${value}` : value,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                  />
                  <Legend />
                  <Line 
                    yAxisId="bookings"
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#3498DB" 
                    strokeWidth={2} 
                    name="Bookings" 
                  />
                  <Line 
                    yAxisId="revenue"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#E74C3C" 
                    strokeWidth={2} 
                    name="Revenue (₹)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ParkingStatistics; 