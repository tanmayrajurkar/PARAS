import { Link } from "react-router-dom";
import useDistance from '../../hooks/useDistance';

const ParkCard = ({
  park,
  duration,
  onClick,
  containerClassName,
  imageClassName,
  showButton,
}) => {
  // Log the coordinates to debug
  console.log('Park coordinates:', park.latitude, park.longitude);
  
  // Convert coordinates to numbers if they're strings
  const parkLat = Number(park.latitude);
  const parkLng = Number(park.longitude);
  
  const calculatedDistance = useDistance(parkLat, parkLng);

  return (
    <Link
      to={`/listbookings/${park.id}`}
      className={`bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${containerClassName}`}
      onClick={onClick}
    >
      <figure className="relative">
        <img
          src={park.image_url}
          alt={park.name}
          className={`w-full object-cover ${imageClassName}`}
        />
        <div className="absolute top-3 left-3 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ₹{park.price_per_hour}/hr
        </div>

        {showButton && (
          <button className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#007BFF] text-white px-6 py-2 rounded-full font-medium transition-colors duration-300 hover:bg-[#0056D2] shadow-lg z-10">
            Book Now
          </button>
        )}
      </figure>

      <div className="p-4">
        <h2 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1">
          {park.address}
        </h2>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-sm">
              TotalBasements : <span className="font-semibold">{park.basement_total}</span>
            </p>
          </div>

          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">
              Distance: <span className="font-semibold">{calculatedDistance || 'Calculating...'}</span>
            </p>
          </div>

          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">
              Duration: <span className="font-semibold">{duration}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ParkCard;
