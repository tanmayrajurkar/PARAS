import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  singlePark: null,
  userLocation: { lat: 12.9716, lng: 77.5946 },
  distance: {},
  duration: "",
  isAvailableSlots: false,
  availableSlots: [],
  allSlotsOccupied: false,
  bookingsDetails: {
    date: "",
    basement: "",
    hour: "",
    duration: "",
    timeRange: "",
  },
  selectedSlot: null,
  tempBooking: null,
};

const validateTimeRange = (timeRange) => {
  const [startTime, endTime] = timeRange.split('-').map(t => t.trim());
  const timeRegex = /^([01]?[0-9]|2[0-3]):00$/;
  
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    throw new Error('Invalid time format');
  }
  
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  
  if (endHour <= startHour || endHour > 24) {
    throw new Error('Invalid time range');
  }
  
  return true;
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setSinglePark: (state, action) => {
      state.singlePark = action.payload;
    },
    setBookingDetails: (state, action) => {
      const { timeRange } = action.payload;
      if (timeRange) {
        try {
          validateTimeRange(timeRange);
        } catch (error) {
          console.error('Invalid time range:', error);
          return;
        }
      }
      state.bookingsDetails = action.payload;
      toast.success("Booking Details Submitted");
    },
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
      toast.success("You have selected a spot");
    },
    reSelectedSlot: (state) => {
      state.selectedSlot = null;
    },
    toggleAvailableSlots: (state, action) => {
      state.isAvailableSlots = action.payload;
    },
    setAvailableSlots: (state, action) => {
      state.availableSlots = action.payload;
    },
    setAllSlotsOccupied: (state, action) => {
      state.allSlotsOccupied = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setDistance: (state, action) => {
      state.distance = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setTempBooking: (state, action) => {
      state.tempBooking = action.payload;
    },
    clearBookings: (state) => {
      return initialState;
    },
  },
});

export const {
  setSinglePark,
  setBookingDetails,
  setSelectedSlot,
  reSelectedSlot,
  setUserLocation,
  setDistance,
  setDuration,
  toggleAvailableSlots,
  setAllSlotsOccupied,
  setAvailableSlots,
  setTempBooking,
  clearBookings,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
