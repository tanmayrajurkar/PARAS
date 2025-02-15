import { MdDirectionsCar, MdAccessTime, MdLocalParking, MdLocationOn } from 'react-icons/md';
import { FaRupeeSign, FaParking } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function DisplayPark({ distance, duration, park, onNavigate }) {
  const navigate = useNavigate();
  
  if (!distance.text && !duration) return null;

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-4 transform hover:scale-[1.02] transition-all duration-300 min-h-min">
      {/* Header with Image */}
      <div className="relative mb-4 rounded-lg overflow-hidden">
        <img 
          src={park.image_url} 
          alt={park.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-white text-center px-4">{park.name}</h2>
        </div>
      </div>

      {/* Location Info */}
      <div className="flex items-start gap-2 mb-4 bg-gray-800 p-3 rounded-lg">
        <MdLocationOn className="text-red-400 text-xl flex-shrink-0 mt-1" />
        <p className="text-gray-300 text-sm">{park.address}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-750 transition-colors">
          <div className="flex items-center gap-2">
            <MdDirectionsCar className="text-blue-400 text-lg" />
            <p className="text-gray-400 text-xs">Distance</p>
          </div>
          <p className="text-white font-semibold ml-6 text-sm">{distance.text}</p>
        </div>

        <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-750 transition-colors">
          <div className="flex items-center gap-2">
            <MdAccessTime className="text-green-400 text-lg" />
            <p className="text-gray-400 text-xs">Duration</p>
          </div>
          <p className="text-white font-semibold ml-6 text-sm">{duration}</p>
        </div>

        <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-750 transition-colors">
          <div className="flex items-center gap-2">
            <FaParking className="text-yellow-400 text-lg" />
            <p className="text-gray-400 text-xs">Slots</p>
          </div>
          <p className="text-white font-semibold ml-6 text-sm">{park.number_of_slots} Available</p>
        </div>

        <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-750 transition-colors">
          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-purple-400 text-lg" />
            <p className="text-gray-400 text-xs">Price/Hour</p>
          </div>
          <p className="text-white font-semibold ml-6 text-sm">₹{park.price_per_hour}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button 
          onClick={() => navigate(`/listbookings/${park.id}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors duration-300 font-medium flex items-center justify-center gap-2 text-sm"
        >
          <FaParking className="text-lg" />
          Book Now
        </button>
        <button 
          onClick={() => onNavigate(park)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg transition-colors duration-300 font-medium flex items-center justify-center gap-2 text-sm"
        >
          <MdDirectionsCar className="text-lg" />
          Navigate
        </button>
      </div>
    </div>
  );
}
