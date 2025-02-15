import { useDispatch, useSelector } from "react-redux";
import { useMap } from "../MapProvider"; // Custom hook to manage map state
import {
  ParksGrid,
  CityFilter,
  ErrorElement,
  Places,
  LoadingSkeleton,
} from "../components/index";
import { useEffect, useState, useMemo } from "react";
import {
  fetchParkingData,
  resetFilters,
} from "../features/bookings/parkingSlice";
import { setUserLocation } from "../features/bookings/bookingsSlice"; // Redux action for setting location which user selects in places component
import styles from "../style";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom'; // Add this if not already present
import { FaMapMarkerAlt } from 'react-icons/fa'; // Import the icon

// Add this function at the top of your file, outside the component
const normalizeCity = (cityName) => {
  const cityMap = {
    'bengaluru': 'bangalore',
    'bangalore': 'bangalore'
  };
  return cityMap[cityName.toLowerCase()] || cityName.toLowerCase();
};

const ListBookings = () => {
  const dispatch = useDispatch();
  const { isLoaded } = useMap(); // Check if the map is loaded
  const [userCity, setUserCity] = useState("bangalore");
  const [cityLoading, setCityLoading] = useState(false); // State to manage loading state when changing cities
  const { cities, loading, error } = useSelector((state) => state.parking);
  const location = useLocation();
  const { state } = location;

  // Fetch parking data when the component mounts consisting of cities and complexes and IT Parks from two apis using promise.all
  useEffect(() => {
    dispatch(fetchParkingData());
  }, [dispatch]);

  // Handler for when user selects a new location by using places from google map api
  //handleLocationSelect is a callback function sending data from child to parent which is userlocation and city
  //city is derived from extracting the city name from address components using 'locality' type

  /**
  using a callback function like handleLocationSelect is better than using useEffect for handling immediate user actions, preventing unnecessary renders and providing controlled execution.
   */
  const handleLocationSelect = (location, city) => {
    setCityLoading(true);
    const normalizedCity = normalizeCity(city || 'Bangalore');
    
    console.log('Setting city:', {
      original: city,
      normalized: normalizedCity
    });
    
    dispatch(setUserLocation(location));
    setUserCity(normalizedCity);
    dispatch(resetFilters());
    
    setTimeout(() => {
      setCityLoading(false);
    }, 1000);
    toast.success(`${normalizedCity} selected successfully`);
  };

  // Check if there are parks available in the selected city
  // Users can select a city using the Places component, which utilizes the Google Places Autocomplete API.
  // When a location is selected, the city is extracted from the address components.
  // The selected city filters available parking options, showing only relevant parks.
  // The hasParksInCity check confirms if parks are available in the selected city.

  /**
   * useMemo prevents unnecessary re-computation of complex calculations (such as filtering or transforming data for markers in map) during re-renders, ensuring smoother map interactions
   */
  const hasParksInCity = useMemo(() => {
    const cityNames = cities.map(city => city.name.toLowerCase());
    const normalizedUserCity = normalizeCity(userCity);
    
    console.log('City comparison:', {
      availableCities: cityNames,
      userCity: normalizedUserCity
    });
    
    return cityNames.includes(normalizedUserCity);
  }, [userCity, cities]);

  useEffect(() => {
    if (state?.location) {
      const normalizedCity = normalizeCity(state.city || 'bangalore');
      dispatch(setUserLocation(state.location));
      setUserCity(normalizedCity);
      dispatch(resetFilters());
    }
  }, [state]);

  // Add these console logs to help debug
  useEffect(() => {
    console.log('Current userCity:', userCity);
    console.log('Available cities:', cities);
    console.log('Has parks:', hasParksInCity);
  }, [userCity, cities, hasParksInCity]);

  // Add this near your other useSelector calls
  const parkingState = useSelector((state) => {
    console.log('Full parking state:', state.parking);
    return state.parking;
  });

  // Add this before the return statement
  const filteredParks = useSelector(state => {
    const parks = state.parking.itParks;
    console.log('IT Parks data:', {
      allParks: parks,
      userCity,
      parksForCity: parks.filter(park => 
        park.cities.name.toLowerCase() === normalizeCity(userCity)
      )
    });
    return parks;
  });

  if (cityLoading || loading || !isLoaded) {
    return <LoadingSkeleton count={6} />;
  }

  if (error) {
    return <ErrorElement />;
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-blue-500 mr-2" /> {/* Icon for the city */}
            <span className="text-lg font-bold">{userCity || 'Select a city'}</span> {/* City name */}
          </div>
        </div>
        
        <div className="mx-auto w-full lg:w-1/3">
          <Places setUserLocation={handleLocationSelect} />
          {/* Display an error message if no parks are found in the selected city */}
          {!hasParksInCity && userCity && (
            <p className={`error-message mt-2 ${styles.flexCenter}`}>
              No services in this area
            </p>
          )}
        </div>
        <div className="flex-1">
          <ParksGrid 
            userCity={normalizeCity(userCity)} 
            key={userCity} // Add this to force re-render when city changes
          />
        </div>
      </div>
    </>
  );
};

export default ListBookings;
