import { useState, useRef, useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { InputField } from "../index";

export default function Places({ setUserLocation }) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const [focussedIndex, setFocussedIndex] = useState(-1); // State to track which suggestion is currently focused by the user initially none

  // Using the usePlacesAutocomplete hook to manage location input and suggestions
  const {
    ready, // Indicates if the autocomplete service is ready to use
    value,
    setValue,
    suggestions: { status, data }, // Suggestions status and list of suggestion data which is the locations from google map api
    clearSuggestions, // Function to clear the current suggestions when user selects a location or suggestion
  } = usePlacesAutocomplete();

  // Ref to hold references to suggestion DOM elements
  // suggestionRefs facilitates DOM manipulation, allowing the currently focused suggestion to scroll into vie
  const suggestionRefs = useRef([]);

  // Function to handle the selection of a suggestion or location
  const handleSelect = async (val) => {
    setValue(val, false); // Setting the value without triggering new suggestions
    clearSuggestions(); // Clear any existing suggestions from the dropdown
    setDropdownVisible(false);
    setFocussedIndex(-1); // Reset the focused index which is none

    // Use the selected address to get geocode data (latitude and longitude)
    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);

    // Extract the city name from address components
    // Look for 'locality' type
    // When a location is selected, the city is extracted from the address components.
    // The selected city filters available parking options, showing only relevant parks.
    const cityComponent = results[0].address_components.find((component) =>
      component.types.includes("locality")
    );
    const city = cityComponent ? cityComponent.long_name : "unknown city";

    setUserLocation({ lat, lng }, city);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      //The focussedIndex starts at -1 to represent that no suggestion is focused initially.
      // The first time the user navigates down using the "ArrowDown" key, 
      //it updates focussedIndex to 0, thus focusing on the first suggestion.
      // Move focus to the next suggestion, wrapping around if at the end
      //(if there 4 suggestions for locations)
      // prevIndex is 3 → focussedIndex becomes (3 + 1) % 4 = 0 (focuses back on Suggestion 1).
      // This results in 0, meaning the first suggestion  is now focused.
      setFocussedIndex((prevIndex) => (prevIndex + 1) % data.length);
      e.preventDefault();
    }
    if (e.key === "ArrowUp") {
      setFocussedIndex(
        (prevIndex) => (prevIndex - 1 + data.length) % data.length
      );
      e.preventDefault();
    }
    if (e.key === "Enter") {
      // The focussedIndex should be 0 or greater, meaning at least one suggestion is highlighted.
      if (focussedIndex >= 0) {
        // his accesses the suggestion object from the data array (locations) based on the current focussedIndex.
        // .description: retrieves the textual description of the selected suggestion or location.
        handleSelect(data[focussedIndex].description);
      }
    }
  };

  // main purpose here is to ensure that the currently focused suggestion is brought into view
  useEffect(() => {
    // it runs every time the focussedIndex changes.
    // checks if the reference to the currently focused suggestion element exists in the suggestionRefs
    if (focussedIndex >= 0 && suggestionRefs.current[focussedIndex]) {
      suggestionRefs.current[focussedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        //  it will scroll the element into view while maintaining its current position relative to the viewport.
      });
    }
  }, [focussedIndex]);

  return (
    <div className="relative">
      <InputField
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setDropdownVisible(true);
        }}
        disabled={!ready}
        onKeyDown={handleKeyDown}
        className="w-full p-2 font-semibold text-gray-100 rounded  bg-gray-800 border border-gray-200"
        placeholder="Enter your location"
      />
      {isDropdownVisible && status === "OK" && (
        <ul className="absolute z-50 w-full bg-gray-800 scroll-smooth rounded shadow-lg font-poppins max-h-60  overflow-y-auto">
          {data.map(({ place_id, description }, index) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              // render each suggestion in the dropdown, using the ref prop to link each suggestion's
              // actual HTML element (DOM node) to its corresponding index in suggestionRefs.current.
              ref={(el) => (suggestionRefs.current[index] = el)}
              className={`p-2 cursor-pointer hover:text-gray-100 text-gray-200 ${
                index === focussedIndex ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
      {isDropdownVisible && status !== "OK" && (
        <p className="text-gray-200">No results found</p>
      )}
    </div>
  );
}
