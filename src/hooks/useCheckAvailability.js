import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { supabase } from '../lib/supabase';
import {
  toggleAvailableSlots,
  setAvailableSlots,
  setAllSlotsOccupied,
} from "../features/bookings/bookingsSlice";

const useCheckAvailability = () => {
  const dispatch = useDispatch();
  const { singlePark } = useSelector((state) => state.bookings);
  const { bookingsDetails } = useSelector((state) => state.bookings);

  const checkAvailability = async () => {
    try {
      dispatch(toggleAvailableSlots(true));
      
      if (!singlePark) {
        toast.error('Park data not found');
        return;
      }

      // Fetch slots from all basements
      const { data: slots, error } = await supabase
        .from('parking_slots')
        .select('*')
        .eq('park_id', singlePark.id)
        .eq('status', 'Available')
        .order('slot_number');

      if (error) {
        console.error('Error fetching slots:', error);
        toast.error('Error fetching slot data');
        return;
      }

      // Format and randomize available slots
      const formattedSlots = slots.map(slot => ({
        spot: `${slot.basement_number}-${slot.slot_number}`,
        status: slot.status,
        id: slot.id,
        basement: slot.basement_number
      }));

      // Randomly select 6 slots
      const randomizedSlots = formattedSlots
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

      dispatch(setAvailableSlots(randomizedSlots));
      dispatch(setAllSlotsOccupied(randomizedSlots.length === 0));
      
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Error checking availability");
    } finally {
      dispatch(toggleAvailableSlots(false));
    }
  };

  return checkAvailability;
};

export default useCheckAvailability; 