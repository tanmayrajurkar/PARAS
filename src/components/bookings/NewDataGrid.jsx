import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedItem,
  // Add any new actions you need
} from "../../features/yourNewSlice";
import { NewItemCard } from "../index";
import styles from "../../style";

const NewDataGrid = ({ userCity }) => {
  const dispatch = useDispatch();
  const [itemDistances, setItemDistances] = useState({});
  const [itemDuration, setItemDuration] = useState({});

  const { items, selectedFilter, priceSort, distanceFilter } = useSelector(
    (state) => state.yourNewSlice
  );
  const { userLocation } = useSelector((state) => state.bookings);

  // Filter items based on city
  const itemsInCity = userCity
    ? items.filter((item) => item.city === userCity)
    : items;

  // Apply your filters
  const filteredItems = selectedFilter
    ? itemsInCity.filter((item) => item.category === selectedFilter)
    : itemsInCity;

  // ... rest of your filtering logic

  useEffect(() => {
    if (items.length > 0 && userLocation) {
      itemsInCity.forEach((item) => {
        fetchDirections(userLocation, item);
      });
    }
  }, [items, userLocation]);

  const fetchDirections = (userLocation, item) => {
    // Same Google Maps direction logic
  };

  const handleItemClick = (item) => {
    dispatch(setSelectedItem(item));
    dispatch(setDistance(itemDistances[item.id]));
    dispatch(setDuration(itemDuration[item.id]));
  };

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-[#F5F5F5]">
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <NewItemCard
            key={item.id}
            item={item}
            distance={itemDistances[item.id]?.text || "Calculating..."}
            duration={itemDuration[item.id] || "calculating"}
            onClick={() => handleItemClick(item)}
            containerClassName="transform hover:-translate-y-1 transition-all duration-300"
            imageClassName="h-48 object-cover"
          />
        ))
      ) : (
        <div className={`text-gray-600 h-screen ${styles.flexCenter}`}>
          No items available...
        </div>
      )}
    </div>
  );
};

export default NewDataGrid; 