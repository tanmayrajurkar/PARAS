import { Link } from "react-router-dom";
import styles from "../style";

const UploadParking = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className={`${styles.flexCenter} h-[calc(100vh-64px)]`}>
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          {/* Commercial Parking Card */}
          <Link 
            to="/upload/commercial"
            className="bg-[#2C3E50] p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl text-white font-bold mb-4">
              List Commercial Parking
            </h2>
            <p className="text-gray-300 mb-4">
              List your commercial parking space, IT park parking, or mall parking facilities.
            </p>
            <div className="bg-[#28A745] text-white py-2 px-4 rounded text-center">
              List Commercial Space
            </div>
          </Link>

          {/* Individual Parking Card */}
          <Link 
            to="/upload/individual"
            className="bg-[#2C3E50] p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl text-white font-bold mb-4">
              List Individual Parking
            </h2>
            <p className="text-gray-300 mb-4">
              List your personal parking space, home parking, or single slot parking.
            </p>
            <div className="bg-[#007BFF] text-white py-2 px-4 rounded text-center">
              List Individual Space
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadParking; 