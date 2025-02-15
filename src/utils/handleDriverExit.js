import { supabase } from '../lib/supabase';

/**
 * Handles the exit of a driver from their parking slot
 * @param {number} bookingId - The ID of the booking
 * @returns {Promise<Object>} - Updated booking and history records
 */
export const handleDriverExit = async (bookingId) => {
  try {
    const now = new Date().toISOString();

    // Start a transaction using RPC
    const { data: result, error } = await supabase.rpc('handle_driver_exit', {
      p_booking_id: bookingId,
      p_out_time: now
    });

    if (error) throw error;

    // If RPC is not available, use this alternative approach:
    /*
    // Update booking out_time
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .update({ out_time: now })
      .eq('id', bookingId)
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Update parkinHistory out_time
    const { error: historyError } = await supabase
      .from('parkinHistory')
      .update({ out_time: now })
      .eq('booking_id', bookingId);

    if (historyError) throw historyError;
    */

    return result;
  } catch (error) {
    console.error('Error handling driver exit:', error);
    throw error;
  }
}; 