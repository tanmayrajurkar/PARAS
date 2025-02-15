import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useMap } from "../../MapProvider";
import {
  setUserLocation,
  setSinglePark,
  setDistance,
  setDuration,
} from "../../features/bookings/bookingsSlice";
import { fetchParkingData } from "../../features/bookings/parkingSlice";
import {
  GoogleMap,
  Marker,
  Circle,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Places, DisplayPark } from "../index";
import { useSelector } from "react-redux";
import { flag } from "../../assets";
import { Loader } from "../index";
import {
  mapStyles,
  defaultOptions,
  closeOptions,
  middleOptions,
  farOptions,
} from "../../constants";
import { toast } from 'react-toastify';

const Map = () => {
  const dispatch = useDispatch();
  const { isLoaded } = useMap();
  const [directions, setDirections] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { userLocation, singlePark, distance, duration } = useSelector(
    (state) => state.bookings
  );

  const mapRef = useRef();
  const { itParks, cities, loading } = useSelector((state) => state.parking);

  // Add this useEffect to fetch parking data when component mounts
  useEffect(() => {
    const loadParkingData = async () => {
      if (!dataLoaded) {
        await dispatch(fetchParkingData());
        setDataLoaded(true);
      }
    };
    loadParkingData();
  }, [dispatch, dataLoaded]);

  // Memoize the center of the map to avoid recalculating center coordinates on every render

  const center = useMemo(() => ({ lat: 12.9716, lng: 77.5946 }), []);

  // Memoize parks data to prevent unnecessary re-renders
  const parks = useMemo(() => itParks, [itParks]);

  // Updated map options with better visibility for streets and labels
  const options = useMemo(
    () => ({
      styles: [
        {
          "featureType": "all",
          "elementType": "geometry",
          "stylers": [
            {
              "lightness": 20
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e4e4e4"  // Darker shade for roads
            },
            {
              "weight": 1.5
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text",
          "stylers": [
            {
              "color": "#333333"  // Darker text for road names
            },
            {
              "weight": 0.5
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"  // Slightly darker for main roads
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#d0d0d0"  // Even darker for highways
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e9f5f8"  // Light blue for water
            }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"  // Light gray for landscape
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"  // Hide POI labels to reduce clutter
            }
          ]
        }
      ],
      disableDefaultUI: true,
      clickableIcons: false,
      backgroundColor: '#f5f5f5',
    }),
    []
  );

  // Update circle options for better visibility on light background
  const updatedCloseOptions = {
    ...closeOptions,
    fillColor: "#4285f4",
    fillOpacity: 0.1,
    strokeColor: "#4285f4",
    strokeOpacity: 0.3,
  };

  const updatedMiddleOptions = {
    ...middleOptions,
    fillColor: "#4285f4",
    fillOpacity: 0.05,
    strokeColor: "#4285f4",
    strokeOpacity: 0.2,
  };

  const updatedFarOptions = {
    ...farOptions,
    fillColor: "#4285f4",
    fillOpacity: 0.02,
    strokeColor: "#4285f4",
    strokeOpacity: 0.1,
  };

  // Callback to store map reference when loaded
  // onLoad: This callback is triggered when the Google Map component has finished loading.
  // It saves the map instance in mapRef.current, allowing direct access to map methods (like panTo)
  // without causing re-renders
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  // Add this new function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          dispatch(setUserLocation(pos));
          mapRef.current?.panTo(pos);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Call getCurrentLocation when component mounts
  useEffect(() => {
    const initializeMapAndDirections = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            dispatch(setUserLocation(pos));
            mapRef.current?.panTo(pos);

            // Find and show directions to nearest park
            const nearestPark = findNearestPark(pos, parks);
            if (nearestPark) {
              fetchDirections(nearestPark);
            }
          },
          (error) => {
            console.error("Error getting current location:", error);
            toast.error("Unable to get your location");
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser");
      }
    };

    initializeMapAndDirections();
  }, [parks]); // Add parks as dependency

  // Update the fetchDirections function
  const fetchDirections = (park) => {
    if (!userLocation) {
      getCurrentLocation();
      return;
    }
    
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
          dispatch(setSinglePark(park));
          dispatch(setDistance(result.routes[0].legs[0].distance));
          dispatch(setDuration(result.routes[0].legs[0].duration.text));
        }
      }
    );
  };

  const handleLocationSelect = (position, city) => {
    dispatch(setUserLocation(position));
    setUserCity(city);
    mapRef.current?.panTo(position); // Move the map's center to the user's location
  };

  // Check if there are parks available in the selected city
  // Users can select a city using the Places component, which utilizes the Google Places Autocomplete API.
  // When a location is selected, the city is extracted from the address components.
  // The selected city filters available parking options, showing only relevant parks.
  // The hasParksInCity check confirms if parks are available in the selected city.
  const hasParksInCity = useMemo(
    () => userCity && cities.some((city) => city.name === userCity),
    [userCity, cities]
  );

  // Add this function in Map.jsx after the existing imports
  const findNearestPark = (userLocation, parks) => {
    if (!userLocation || !parks.length) return null;
    
    return parks.reduce((nearest, park) => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(userLocation.lat, userLocation.lng),
        new google.maps.LatLng(park.latitude, park.longitude)
      );
      
      if (!nearest || distance < nearest.distance) {
        return { park, distance };
      }
      return nearest;
    }, null)?.park;
  };

  const handleNavigate = (park) => {
    if (!userLocation) {
      toast.error("Unable to get your location");
      return;
    }
    
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
          dispatch(setSinglePark(park));
          dispatch(setDistance(result.routes[0].legs[0].distance));
          dispatch(setDuration(result.routes[0].legs[0].duration.text));
          // Pan map to show the entire route
          const bounds = new google.maps.LatLngBounds();
          result.routes[0].legs[0].steps.forEach((step) => {
            bounds.extend(step.start_location);
            bounds.extend(step.end_location);
          });
          mapRef.current?.fitBounds(bounds);
        } else {
          toast.error("Could not calculate directions");
        }
      }
    );
  };

  if (!isLoaded || loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] mb-4 rounded-lg gap-4">
      <div className="w-full md:w-2/5 p-6 bg-[#14161a] text-gray-200 rounded-lg flex flex-col">
        <p className="text-lg mb-4">
          <img src={flag} alt="Flag" className="inline-block ml-2 h-6 w-6" />
        </p>

        <Places setUserLocation={handleLocationSelect} />
         
        {directions && (
          <div className="flex-1 mt-6 overflow-y-auto custom-scrollbar">
            <DisplayPark
              distance={distance}
              duration={duration}
              park={singlePark}
              onNavigate={handleNavigate}
            />
          </div>
        )}
      </div>
      <div className="flex-1 h-full">
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
              key={directions.routes[0].legs[0].duration.value}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}
          {userLocation && (
            <>
              <Marker position={userLocation} icon={flag} />
              {parks.map((park) => (
                <Marker
                  key={park.id}
                  position={{ lat: park.latitude, lng: park.longitude }}
                  onClick={() => {
                    fetchDirections(park);
                  }}
                  label={{
                    text: park.name,
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                />
              ))}
              <Circle
                center={userLocation}
                radius={15000}
                options={updatedCloseOptions}
              />
              <Circle
                center={userLocation}
                radius={30000}
                options={updatedMiddleOptions}
              />
              <Circle
                center={userLocation}
                radius={45000}
                options={updatedFarOptions}
              />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};


export default Map;