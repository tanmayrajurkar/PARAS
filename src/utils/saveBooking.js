import { supabase } from '../lib/supabase';
import { updateSlotStatus } from './slotManagement';

/**
 * Saves a booking to the database.
 * @param {Object} bookingData - The booking data to save.
 * @returns {Promise<Object>} - The saved booking data.
 * @throws Will throw an error if the booking could not be saved.
 */
export const saveBooking = async (bookingData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user found');
    }

    if (!bookingData.start_time || !bookingData.end_time) {
      throw new Error('Start time and end time are required');
    }

    // Validate booking time is within next 24 hours
    const now = new Date();
    const maxBookingTime = new Date(now);
    maxBookingTime.setDate(maxBookingTime.getDate() + 1);
    maxBookingTime.setHours(23, 59, 59, 999);
    
    const requestedStartTime = new Date(bookingData.start_time);
    const requestedEndTime = new Date(bookingData.end_time);

    // Validate dates are valid
    if (isNaN(requestedStartTime.getTime()) || isNaN(requestedEndTime.getTime())) {
      throw new Error('Invalid date format provided');
    }

    if (requestedStartTime < now || requestedStartTime > maxBookingTime) {
      throw new Error('Bookings must be within today or tomorrow (until 23:59)');
    }

    // Check for overlapping bookings
    const bookingDate = requestedStartTime.toISOString().split('T')[0];
    
    console.log('Checking for time conflicts:', {
      requested: {
        date: bookingDate,
        start: requestedStartTime.toLocaleTimeString(),
        end: requestedEndTime.toLocaleTimeString(),
        slot_id: bookingData.slot_id
      }
    });

    // Get active bookings for this slot and date
    const { data: activeBookings, error: activeError } = await supabase
      .from('bookings')
      .select('*')
      .eq('slot_id', bookingData.slot_id)
      .eq('booking_status', 'active')
      .gte('start_time', `${bookingDate}T00:00:00`)
      .lt('start_time', `${bookingDate}T23:59:59`);

    if (activeError) {
      console.error('Error fetching active bookings:', activeError);
      throw new Error('Failed to check slot availability');
    }

    console.log('Existing bookings for this slot:', activeBookings?.map(booking => ({
      id: booking.id,
      start: new Date(booking.start_time).toLocaleTimeString(),
      end: new Date(booking.end_time).toLocaleTimeString()
    })));

    // Check for time conflicts
    const overlappingBookings = activeBookings?.filter(booking => {
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = new Date(booking.end_time);

      // Skip if booking has already ended
      if (bookingEnd < now) {
        return false;
      }

      // Check for time overlap
      const hasOverlap = (
        // Case 1: New booking starts during an existing booking
        (requestedStartTime >= bookingStart && requestedStartTime < bookingEnd) ||
        // Case 2: New booking ends during an existing booking
        (requestedEndTime > bookingStart && requestedEndTime <= bookingEnd) ||
        // Case 3: New booking completely contains an existing booking
        (requestedStartTime <= bookingStart && requestedEndTime >= bookingEnd)
      );

      if (hasOverlap) {
        console.log('Time conflict found:', {
          existing: {
            start: bookingStart.toLocaleTimeString(),
            end: bookingEnd.toLocaleTimeString()
          },
          requested: {
            start: requestedStartTime.toLocaleTimeString(),
            end: requestedEndTime.toLocaleTimeString()
          }
        });
      }

      return hasOverlap;
    });

    if (overlappingBookings?.length > 0) {
      throw new Error('This slot is already booked for the selected time period');
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: user.id,
        slot_id: bookingData.slot_id,
        start_time: requestedStartTime.toISOString(),
        end_time: requestedEndTime.toISOString(),
        vehicle_number: bookingData.vehicle_number,
        booking_status: 'active',
        out_time: null
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('Booking error details:', bookingError);
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    // Update slot status to Occupied
    await updateSlotStatus(bookingData.slot_id, 'Occupied');

    return booking; // Return the created booking data
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error; // Re-throw the error after logging
  }
};
