import { Button, SingleSlot } from "../index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SlotDisplay = ({ data }) => {
  const navigate = useNavigate();

  const { selectedSlot, allSlotsOccupied, availableSlots, isAvailableSlots } =
    useSelector((state) => state.bookings);
  //The current state of the selected slot from the Redux store.
  const duration = useSelector(
    (state) => state.bookings.bookingsDetails.duration
  );

  // Ensure availableSlots is populated
  console.log('Available Slots:', availableSlots);

  return (
    <div className="flex flex-col items-center w-full h-full max-w-lg mx-auto py-2 rounded bg-gray-900">
      {isAvailableSlots ? (
        <p className="text-orange-500 text-center font-bold font-poppins">
          Fetching Availability. Please Wait....
        </p>
      ) : (
        <>
          {/* If all slots are occupied, display a warning message */}
          {allSlotsOccupied && (
            <div className="text-red-500 text-lg mb-4">
              All spots are currently occupied. Please select a different time.
            </div>
          )}

          {/* Entry indicator */}
          <div className="flex flex-col items-center w-full mb-2">
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <span className="text-white">Entry</span>
              </div>
              <span className="text-white">&#8594;</span>
            </div>
          </div>

          {/* Slot display section */}
          <div className="flex w-full">
            {/* Left column for the first three slots */}
            <div className="flex flex-col items-center w-1/2">
              {availableSlots.slice(0, 3).map((slot, i) => (
                <SingleSlot
                  key={i}
                  slot={slot}
                  isSelected={selectedSlot === slot}
                />
              ))}
            </div>
            {/* Dotted line between the two columns */}
            <div className="border-l-2 border-dashed border-white h-auto mx-2"></div>

            {/* Right column for the next three slots */}
            <div className="flex flex-col items-center w-1/2">
              {availableSlots.slice(3, 6).map((slot, i) => (
                <SingleSlot
                  key={i + 3}
                  slot={slot}
                  isSelected={selectedSlot === slot}
                />
              ))}
            </div>z
          </div>

          <span className="text-white mt-2">Exit</span>
          <span className="text-white">&#8592;</span>

          {/* If a slot is selected, display details */}
          {selectedSlot && (
            <>
              <div className="mt-2 font-poppins">
                <span className="text-gray-200"> Selected Slot:</span>
                <span className="text-orange-400"> {selectedSlot.spot}</span>
              </div>
              <div className="mt-2 font-poppins">
                <span className="text-gray-200 mt-2 font-poppins">
                  Total Amount:{" "}
                </span>
                <span className="text-orange-400 font-poppins">
                  Rs
                  {data.price_per_hour && duration
                    ? data.price_per_hour * duration
                    : 0}
                </span>
              </div>

              {/* Button to navigate to the confirmation page */}
              <Button
                onClick={() => navigate(`/listbookings/${data.id}/confirm`)}
                className="mt-2"
              >
                Book Now
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SlotDisplay;
