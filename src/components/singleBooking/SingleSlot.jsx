// The `SingleSlot` component represents an individual parking slot in a parking management application.
import { useDispatch} from "react-redux";
import { InputField } from "../index";
import { car } from "../../assets";
import { setSelectedSlot } from "../../features/bookings/bookingsSlice";
import styles from "../../style";

const SingleSlot = ({ slot, isSelected}) => {
  const dispatch = useDispatch()
  const isOccupied = slot.status === "Occupied";

  // Function to handle slot selection
  const handleChange = () => {
    if(!isOccupied){
      dispatch(setSelectedSlot(slot));
    }
  }
  return (
    <label className="flex items-center cursor-pointer mb-1">
      {/* Hidden checkbox input to maintain selection state */}
      <InputField
        type="checkbox"
        className="hidden"
        disabled={isOccupied}
        checked={isSelected}
        onChange={handleChange}
      />
        {/* Visual representation of the slot */}
      <div
        className={`${styles.flexCenter} w-20 h-20 border-l-2 border-t-2 border-b-2 border-orange-400 bg-gray-900 relative group transition-colors duration-200 ${
          isOccupied ? "opacity-50" : isSelected ? "bg-yellow-400" : ""
        }`}
      >
        {/* Display car icon if occupied, else prompt user to select */}
        {slot.status === "Occupied" ? (
          <img
            src={car}
            alt="Car Icon"
            className="w-10 h-10 group-hover:opacity-100" // Show car icon for occupied slots
            />
          
        ) : (
          <div className="text-gray-100">select spot</div>
        )}
            {/* Display the slot identifier */}
       <span className="absolute bottom-1 right-1 text-gray-400 text-sm">
          {slot.spot}  {/* Now shows as "B1-1" format */}
        </span>
          {/* Hover effect overlay for available slots */}
        {slot.status !== "Occupied" && (
          <div className="absolute inset-0 bg-gray-600 opacity-0 group-hover:opacity-50 transition-opacity"></div>
        )}
      </div>
    </label>
  );
};

export default SingleSlot;
