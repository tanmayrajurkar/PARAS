import { Map } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchParkingData } from "../features/bookings/parkingSlice";
import { Loader, ErrorElement } from "../components/index";
import { useJsApiLoader } from "@react-google-maps/api";

// Define libraries as a constant outside the component
const libraries = ["places"]; // Add any additional libraries you need

const MapBookings = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.parking);

  // Use useJsApiLoader to load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDPfNKga9dfQY3EEpH5pwzkMhDG27ckqQ0", // Replace with your actual API key
    libraries, // Use the constant here
  });

  useEffect(() => {
    dispatch(fetchParkingData());
  }, [dispatch]);

  if (loading || !isLoaded) {
    return <Loader />;
  }

  if (error) {
    return <ErrorElement />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Map />
    </div>
  );
};

export default MapBookings;
