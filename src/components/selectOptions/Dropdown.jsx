import { Link } from "react-router-dom";
const Dropdown = ({ options }) => {
  return (
    <ul className="absolute bg-gray-800 z-50 text-gray-200 border border-gray-300 rounded-lg max-h-60 overflow-y-auto  mt-1 w-[280px] sm:w-[400px]">
      {options.map((option) => (
        <Link to={`/bookings/${option.id}`} key={option.id}>
          <li className="p-2 hover:bg-gray-600 hover:text-gray-100 font-poppins">
            {option.address}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default Dropdown;
