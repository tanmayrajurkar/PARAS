import { useDispatch, useSelector } from "react-redux";
import { setSinglePark } from "../features/bookings/bookingsSlice";
import {
  BookingFilters,
  SlotDisplay,
  Carousel,
  ParkNotFound,
  Navbar,
} from "../components/index";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSlotAvailability } from '../utils/slotManagement';
import { toast } from "react-toastify";

const SingleBooking = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { itParks } = useSelector((state) => state.parking);
  const [loading, setLoading] = useState(true);

  // Find the park
  const singlePark = itParks.find((park) => park.id === Number(id));

  useEffect(() => {
    const initializeParkData = async () => {
      if (singlePark) {
        try {
          const slots = await getSlotAvailability(singlePark.id);

          const basementData = {};
          slots.forEach(slot => {
            if (!basementData[slot.basement_number]) {
              basementData[slot.basement_number] = {
                total_spots: 0,
                available_spots: 0,
                spots: []
              };
            }

            basementData[slot.basement_number].total_spots++;
            if (slot.status === 'Available') {
              basementData[slot.basement_number].available_spots++;
            }

            basementData[slot.basement_number].spots.push({
              id: slot.id,
              spot: slot.slot_number,
              status: slot.status
            });
          });

          dispatch(setSinglePark({
            ...singlePark,
            basements: basementData
          }));
        } catch (error) {
          console.error('Error initializing park data:', error);
          toast.error('Error loading parking data');
        }
      }
      setLoading(false);
    };

    initializeParkData();
  }, [singlePark, dispatch]);

  // Debug logging
  useEffect(() => {
    console.log('Single Park Data:', singlePark);
  }, [singlePark]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!singlePark) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="w-full bg-white shadow-md">
          <Navbar />
        </div>
        <div className="container mx-auto px-4 py-6">
          <ParkNotFound />
        </div>
      </div>
    );
  }

  // Generate basement array for BookingFilters
  const basementArray = Array.from(
    { length: singlePark.basement_total }, 
    (_, i) => `B${i + 1}`
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="w-full bg-[#2C3E50]">
        <div className="w-full">
          <Navbar />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 mx-auto">
          <Carousel data={singlePark} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <BookingFilters 
              basements={basementArray}
              singlePark={singlePark} 
            />
          </div>
          <div className="h-full flex justify-center">
            <SlotDisplay data={singlePark} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBooking;
