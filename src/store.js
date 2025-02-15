import { configureStore } from "@reduxjs/toolkit";
import parkingReducer from "./features/bookings/parkingSlice";
import bookingsReducer from "./features/bookings/bookingsSlice";
import bookedReducer from "./features/mybookings/bookedSlice";
import authReducer from "./features/authentication/authUserSlice"
const store = configureStore({
  reducer: {
    parking: parkingReducer,
    bookings: bookingsReducer,
    booked: bookedReducer,
    auth: authReducer
  },
});

export default store;
