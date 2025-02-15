import { useCallback, useMemo, useRef, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { flag } from "../../assets";
import { mapStyles } from "../../constants";

const BookingsMap = ({ userLocation, selectedPark }) => {
  const [directions, setDirections] = useState(null);

  if (!userLocation || !selectedPark) {
    return <div className="text-gray-200 bg-primary">Loading map...</div>;
  }

  const mapRef = useRef();

  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      styles: mapStyles,
    }),
    []
  );

  const center = useMemo(
    () => ({ lat: userLocation.lat, lng: userLocation.lng }),
    []
  );

  const park = useMemo(() => selectedPark, [selectedPark]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    map.panTo(userLocation);
  }, []);

  const fetchDirections = (park, userLocation) => {
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
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  };

  return (
    <div className="flex-1 h-96">
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="w-full h-full rounded-lg"
        options={options}
        onLoad={onLoad}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#1976D2",
                strokeWeight: 5,
              },
            }}
          />
        )}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={flag} />

            <Marker
              key={park.id}
              position={{
                lat: park.latitude,
                lng: park.longitude,
              }}
              onClick={() => fetchDirections(park, userLocation)}
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default BookingsMap;
