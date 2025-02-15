import { Link } from "react-router-dom";

const NewItemCard = ({
  item,
  distance,
  duration,
  onClick,
  containerClassName,
  imageClassName,
  showButton,
}) => {
  return (
    <Link
      to={`/newlistings/${item.id}`}
      className={`bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${containerClassName}`}
      onClick={onClick}
    >
      <figure className="relative">
        <img
          src={item.image_url}
          alt={item.name}
          className={`w-full object-cover ${imageClassName}`}
        />
        <div className="absolute top-3 left-3 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ₹{item.price}/hr
        </div>
      </figure>

      <div className="p-4">
        <h2 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1">
          {item.name}
        </h2>
        
        {/* Customize these fields based on your data structure */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            {/* Add your custom icons and fields */}
          </div>

          <div className="flex items-center text-gray-600">
            <p className="text-sm">
              Distance: <span className="font-semibold">{distance}</span>
            </p>
          </div>

          <div className="flex items-center text-gray-600">
            <p className="text-sm">
              Duration: <span className="font-semibold">{duration}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewItemCard; 