import { useSelector, useDispatch } from "react-redux";
import { setAvailableSlots, setAllSlotsOccupied } from "../../features/bookings/bookingsSlice";
import { toggleAvailableSlots } from "../../features/bookings/bookingsSlice";
import { toast } from "react-hot-toast";
import { supabase } from "../../lib/supabase";

/**
 * Custom hook to check the availability of parking slots in a selected basement of a park.
 * This hook manages the state of available slots and provides a method to check availability based on user input.
 */
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

      const startTime = new Date(bookingsDetails.date);
      startTime.setHours(parseInt(bookingsDetails.hour), 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + parseInt(bookingsDetails.duration));

      // Get all slots for the park
      const { data: parkingSlots, error: slotsError } = await supabase
        .from('parking_slots')
        .select('*')
        .eq('park_id', singlePark.id);

      if (slotsError) throw slotsError;

      // Check existing bookings for these slots
      const { data: existingBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('slot_id')
        .overlaps('start_time', 'end_time', startTime.toISOString(), endTime.toISOString());

      if (bookingsError) throw bookingsError;

      // Filter out booked slots
      const bookedSlotIds = existingBookings.map(booking => booking.slot_id);
      const availableSlots = parkingSlots
        .filter(slot => !bookedSlotIds.includes(slot.id))
        .map(slot => ({
          id: slot.id,
          spot: slot.slot_number,
          status: 'Available'
        }));

      // Take only first 6 available slots
      const slotsToShow = availableSlots.slice(0, 6);
      
      dispatch(setAvailableSlots(slotsToShow));
      dispatch(setAllSlotsOccupied(slotsToShow.length === 0));

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
