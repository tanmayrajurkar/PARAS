import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSinglePark,
  setDistance,
  setDuration,
} from "../../features/bookings/bookingsSlice";
import { ParkCard } from "../index";
import styles from "../../style";

const ParksGrid = ({ userCity }) => {
  const dispatch = useDispatch();
  const [parkDistances, setParkDistances] = useState({});
  const [parkDuration, setParkDuration] = useState({});

  const { itParks, selectedComplex, priceSort, distanceFilter } = useSelector(
    (state) => state.parking
  );
  const { userLocation } = useSelector((state) => state.bookings);

  const parks = useSelector(state => state.parking.itParks);
  
  console.log('ParksGrid render:', {
    userCity,
    totalParks: parks.length,
    parks
  });

  useEffect(() => {
    console.log('Sample park data:', {
      firstPark: parks[0],
      userCity,
      cityMatch: parks[0]?.cities?.name?.toLowerCase() === userCity.toLowerCase()
    });
  }, [parks, userCity]);

  const filteredParks = parks.filter(park => 
    park.cities.name.toLowerCase() === userCity.toLowerCase()
  );

  console.log('Filtered parks:', filteredParks);

  if (filteredParks.length === 0) {
    return <div>Service will start soon....</div>;
  }

  const filteredItParks = selectedComplex
    ? filteredParks.filter((itPark) => itPark.complex === selectedComplex)
    : filteredParks;

  const filteredByDistance = filteredItParks.filter((itPark) => {
    const distanceValue = parkDistances[itPark.id]?.value || 0;
    switch (distanceFilter) {
      case "0-5 km":
        return distanceValue >= 0 && distanceValue <= 5000;
      case "5-10 km":
        return distanceValue > 5000 && distanceValue <= 10000;
      case "> 10 km":
        return distanceValue > 10000;
      default:
        return true;
    }
  });

  const sortedParks = filteredByDistance.sort((a, b) => {
    if (priceSort === "low") {
      return a.price_per_hour - b.price_per_hour;
    } else if (priceSort === "high") {
      return b.price_per_hour - a.price_per_hour;
    }
    return 0;
  });

  useEffect(() => {
    if (parks.length > 0 && userLocation) {
      filteredParks.forEach((park) => {
        fetchDirections(userLocation, park);
      });
    }
  }, [parks, userLocation, filteredParks]);

  const fetchDirections = (userLocation, park) => {
    if (!userLocation) return;
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: userLocation,
        destination: { lat: park.latitude, lng: park.longitude },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          const distance = result.routes[0].legs[0].distance;
          const duration = result.routes[0].legs[0].duration.text;

          setParkDistances((prev) => ({
            ...prev,
            [park.id]: distance,
          }));

          setParkDuration((prev) => ({
            ...prev,
            [park.id]: duration,
          }));
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  };

  const handleParkClick = (itPark) => {
    dispatch(setSinglePark(itPark));
    const distanceData = parkDistances[itPark.id];
    dispatch(setDistance(distanceData));
    dispatch(setDuration(parkDuration[itPark.id]));
  };

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-[#F5F5F5]">
      {sortedParks.length > 0 ? (
        sortedParks.map((itPark) => (
          <ParkCard
            key={itPark.id}
            park={itPark}
            distance={parkDistances[itPark.id]?.text || "Calculating..."}
            duration={parkDuration[itPark.id] || "calculating"}
            onClick={() => handleParkClick(itPark)}
            containerClassName="transform hover:-translate-y-1 transition-all duration-300"
            imageClassName="h-48 object-cover"
          />
        ))
      ) : (
        <div className={`text-gray-600 h-screen ${styles.flexCenter}`}>
          Service will start soon....
        </div>
      )}
    </div>
  );
};

export default ParksGrid;
