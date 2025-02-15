import { useState, useEffect } from 'react';

const useDistance = (parkLat, parkLng) => {
  const [distance, setDistance] = useState("N/A");

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2 || 
        isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      return "N/A";
    }

    const parsedLat1 = Number(lat1);
    const parsedLon1 = Number(lon1);
    const parsedLat2 = Number(lat2);
    const parsedLon2 = Number(lon2);

    const R = 6371;
    const dLat = (parsedLat2 - parsedLat1) * (Math.PI / 180);
    const dLon = (parsedLon2 - parsedLon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(parsedLat1 * (Math.PI / 180)) *
      Math.cos(parsedLat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return `${distance.toFixed(1)} km`;
  };

  useEffect(() => {
    if (!parkLat || !parkLng || isNaN(parkLat) || isNaN(parkLng)) {
      setDistance("N/A");
      return;
    }

    const getCurrentLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLat = position.coords.latitude;
            const currentLng = position.coords.longitude;
            const calculatedDistance = calculateDistance(
              currentLat,
              currentLng,
              parkLat,
              parkLng
            );
            setDistance(calculatedDistance);
          },
          (error) => {
            console.error("Error getting location:", error);
            setDistance("N/A");
          }
        );
      } else {
        setDistance("N/A");
      }
    };

    getCurrentLocation();
  }, [parkLat, parkLng]);

  return distance;
};

export default useDistance; 