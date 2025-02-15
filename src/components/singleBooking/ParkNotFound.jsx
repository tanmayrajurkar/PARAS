import { useNavigate } from 'react-router-dom';

const ParkNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-6">
      <h2 className="text-2xl font-bold text-red-600">Park Not Found</h2>
      <p className="mt-2 text-gray-600">
        We couldn't find a park with that ID. Please check the URL or return to the homepage.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default ParkNotFound;
