import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputField } from "../components";
import styles from "../style";
import { fetchCities, createParking, createParkingSlots } from "../services/supabase";
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import { getGeocode, getLatLng } from "use-places-autocomplete";

const CommercialParkingForm = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city_id: "",
    type: "",
    number_of_slots: "",
    price_per_hour: "",
    contact_number: "",
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await fetchCities();
        setCities(citiesData);
      } catch (error) {
        toast.error("Failed to load cities");
        console.error("Error loading cities:", error);
      }
    };
    loadCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationFetch = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Get address from coordinates using reverse geocoding
      const results = await getGeocode({
        location: { lat, lng }
      });

      if (results[0]) {
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          address: results[0].formatted_address
        }));
        toast.success("Location coordinates fetched successfully!");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Failed to fetch current location");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to create parking');

      // Create IT park entry
      const parkData = await createParking({
        name: formData.name,
        city_id: parseInt(formData.city_id),
        address: formData.address,
        type: formData.type,
        available_spots: parseInt(formData.number_of_slots),
        price_per_hour: parseInt(formData.price_per_hour),
        profile_id: user.id,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });

      // Create parking slots
      const slotsToCreate = Array.from({ length: parseInt(formData.number_of_slots) }, (_, index) => ({
        park_id: parkData.id,
        basement_number: 'B1',
        slot_number: `B1-${index + 1}`,
        status: 'Available'
      }));

      await createParkingSlots(slotsToCreate);

      toast.success("Commercial parking added successfully!");
      navigate('/');
    } catch (error) {
      toast.error(error.message || "Failed to add parking space");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className={`${styles.flexCenter} py-8`}>
        <div className="bg-[#2C3E50] p-6 rounded-lg max-w-2xl w-[90%] shadow-lg">
          <h2 className="text-2xl text-center text-white mb-6 font-bold">
            List Commercial Parking
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Parking Name"
              type="text"
              name="name"
              placeholder="Enter commercial parking name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white placeholder-gray-400"
            />

            <InputField
              label="Address"
              type="text"
              name="address"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white placeholder-gray-400"
            />

            <div>
              <label className="block text-gray-300 mb-2">City</label>
              <select
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white border border-gray-600 placeholder-gray-400"
              >
                <option value="">Select your city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Parking Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white border border-gray-600 placeholder-gray-400"
              >
                <option value="">Select parking type</option>
                <option value="IT Park">IT Park</option>
                <option value="Mall">Mall</option>
                <option value="Commercial Complex">Commercial Complex</option>
              </select>
            </div>

            <InputField
              label="Number of Slots"
              type="number"
              name="number_of_slots"
              placeholder="Enter total number of parking slots"
              value={formData.number_of_slots}
              onChange={handleChange}
              error={errors.number_of_slots}
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white placeholder-gray-400"
            />

            <InputField
              label="Price per Hour (₹)"
              type="number"
              name="price_per_hour"
              placeholder="Enter price per hour in rupees"
              value={formData.price_per_hour}
              onChange={handleChange}
              error={errors.price_per_hour}
              required
              min="0"
              className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white placeholder-gray-400"
            />

            <InputField
              label="Contact Number"
              type="tel"
              name="contact_number"
              placeholder="Enter 10-digit contact number"
              value={formData.contact_number}
              onChange={handleChange}
              error={errors.contact_number}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white placeholder-gray-400"
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <InputField
                  label="Latitude"
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white placeholder-gray-400"
                  readOnly
                />
              </div>
              
              <div className="flex-1">
                <InputField
                  label="Longitude"
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#34495E] text-white placeholder-gray-400"
                  readOnly
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleLocationFetch}
              className="w-full bg-[#3498DB] hover:bg-[#2980B9] text-white py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Get Current Location
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007BFF] hover:bg-[#0056D2] text-white py-2 rounded-lg transition-colors"
            >
              {loading ? 'Adding...' : 'Submit Listing'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommercialParkingForm;