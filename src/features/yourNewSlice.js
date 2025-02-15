import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Async thunk for fetching data
export const fetchNewData = createAsyncThunk(
  "newData/fetchNewData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("your_api_endpoint");
      if (!response.ok) {
        return rejectWithValue(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue("Data fetch failed: " + error.message);
    }
  }
);

const initialState = {
  // Data arrays
  items: [],
  categories: [],
  
  // Selected/filtered states
  selectedItem: null,
  selectedFilter: null,
  priceSort: "",
  distanceFilter: "",
  
  // Booking related states
  bookingDetails: {
    date: "",
    category: "",
    timeSlot: "",
    duration: "",
    timeRange: "",
  },
  selectedSlot: null,
  availableSlots: [],
  
  // UI states
  loading: false,
  error: null,
  isAvailableSlots: false,
  allSlotsOccupied: false,
  
  // Location related
  userLocation: { lat: 12.9716, lng: 77.5946 }, // Default coordinates
  distance: {},
  duration: "",
};

export const yourNewSlice = createSlice({
  name: "yourNewFeature",
  initialState,
  reducers: {
    // Data management
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    
    // Filter management
    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload;
    },
    setPriceSort: (state, action) => {
      state.priceSort = action.payload;
    },
    setDistanceFilter: (state, action) => {
      state.distanceFilter = action.payload;
    },
    resetFilters: (state) => {
      state.selectedFilter = null;
      state.priceSort = "";
      state.distanceFilter = "";
    },

    // Booking management
    setBookingDetails: (state, action) => {
      const { category, timeSlot, duration, date } = action.payload;
      const endTime = timeSlot + duration;
      state.bookingDetails = {
        category,
        timeSlot,
        duration,
        date,
        timeRange: `${timeSlot < 10 ? "0" : ""}${timeSlot}:00 - ${
          endTime < 10 ? "0" : ""
        }${endTime}:00`,
      };
      toast.success("Booking Details Submitted");
    },
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
      toast.success("Slot selected successfully");
    },
    resetSelectedSlot: (state) => {
      state.selectedSlot = null;
    },

    // Availability management
    setAvailableSlots: (state, action) => {
      state.availableSlots = action.payload;
    },
    toggleAvailability: (state, action) => {
      state.isAvailableSlots = action.payload;
    },
    setAllSlotsOccupied: (state, action) => {
      state.allSlotsOccupied = action.payload;
    },

    // Location management
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setDistance: (state, action) => {
      state.distance = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },

    // Reset state
    clearAll: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.categories = action.payload.categories;
      })
      .addCase(fetchNewData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Failed to fetch data");
      });
  },
});

export const {
  setItems,
  setSelectedItem,
  setSelectedFilter,
  setPriceSort,
  setDistanceFilter,
  resetFilters,
  setBookingDetails,
  setSelectedSlot,
  resetSelectedSlot,
  setAvailableSlots,
  toggleAvailability,
  setAllSlotsOccupied,
  setUserLocation,
  setDistance,
  setDuration,
  clearAll,
} = yourNewSlice.actions;

export default yourNewSlice.reducer; 