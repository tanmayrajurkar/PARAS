import { supabase } from '../lib/supabase';

export const updateSlotStatus = async (slotId, status) => {
  try {
    const { data, error } = await supabase
      .from('parking_slots')
      .update({ status })
      .eq('id', slotId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating slot status:', error);
    throw error;
  }
};

export const getSlotAvailability = async (parkId, basement, date, timeRange) => {
  try {
    const { data, error } = await supabase
      .from('parking_slots')
      .select('*')
      .eq('park_id', parkId)
      .eq('status', 'Available')
      .eq('basement_number', basement);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting slot availability:', error);
    throw error;
  }
}; 