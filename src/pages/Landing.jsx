import { Map, Places } from "../components";
import { useNavigate } from "react-router-dom";
import { parking } from "../assets";
import { useState } from "react";
import ChatWidget from "../components/ChatWidget";

const Landing = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleLocationSelect = (location, city) => {
    setSelectedLocation(location);
    setSelectedCity(city);
  };

  const handleSearch = () => {
    if (selectedLocation) {
      navigate('/listbookings', { 
        state: { 
          location: selectedLocation, 
          city: selectedCity 
        } 
      });
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-120px)] relative md:flex md:flex-row">
        {/* Map Section */}
        <div className="absolute inset-0 md:static md:w-2/3 md:p-8 order-1 md:order-1">
          <div className="h-full rounded-none md:rounded-2xl overflow-hidden 
            md:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.2)] 
            md:hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.25)] 
            transition-shadow duration-300 
            md:h-[calc(100vh-160px)]">
            <Map className="w-full h-full" />
          </div>
        </div>

        

        {/* Search Section */}
        <div className="h-[32vh] md:h-auto md:w-1/3 px-6 py-6 md:p-8 
          bg-white md:bg-[#F5F5F5]
          flex flex-col md:justify-center
          rounded-t-[32px] md:rounded-none
          shadow-[0_-4px_16px_-2px_rgba(0,0,0,0.1)] md:shadow-none
          absolute bottom-0 left-0 right-0 md:static
          z-20 md:z-auto order-2 md:order-2">
          
          {/* Desktop-only image */}
          <div className="hidden md:block mb-8">
            <img 
              src={parking} 
              alt="Parking Illustration" 
              className="w-full h-48 object-contain rounded-lg"
            />
          </div>

          {/* Content Section */}
          <div className="mb-3 md:mb-4">
            <h1 className="text-[32px] md:text-3xl font-bold 
              text-gray-900
              tracking-tight leading-tight mb-2">
              Where to Go?<br/>Find A Parking Spot!!
            </h1>
            {/* <p className="text-[17px] md:text-base text-gray-600 font-normal
              tracking-wide"> 
              Find secure parking spots nearby
            </p> */}
          </div>
          
          <div className="w-full flex flex-col gap-4 md:gap-3">
            <Places 
              setUserLocation={handleLocationSelect}
              customClass="shadow-lg rounded-xl md:rounded-lg text-lg p-4 md:p-3 bg-gray-50 md:bg-white border border-gray-200"
            />
            <button 
              onClick={handleSearch}
              className="w-full bg-[#007BFF] hover:bg-[#0056D2] text-white 
                px-6 py-4 md:py-3 rounded-xl md:rounded-lg transition-colors duration-200 
                font-medium shadow-md text-lg"
            >
              Find Parking
            </button>
          </div>
        </div>
      </div>
      <ChatWidget />
    </>
  );
};

export default Landing;