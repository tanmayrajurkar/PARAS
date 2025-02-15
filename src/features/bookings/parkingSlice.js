import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '../../lib/supabase';

const cityNameMapping = {
  'bengaluru': 'bangalore',
  'bangalore': 'bangalore',
  // Add other variations if needed
};

const initialState = {
  cities: [],
  itParks: [],
  selectedComplex: "",
  priceSort: "",
  distanceFilter: "",
  loading: false,
  error: null,
};

export const fetchParkingData = createAsyncThunk(
  "parkingData/fetchParkingData",
  async (_, { rejectWithValue }) => {
    try {
      const [citiesResponse, itParksResponse] = await Promise.all([
        supabase
          .from('cities')
          .select('*')
          .order('name'),
        supabase
          .from('it_parks')
          .select(`
            *,
            cities:city_id (
              name,
              state,
              country
            )
          `)
          .order('name')
      ]);

      console.log('Supabase responses:', {
        cities: citiesResponse,
        itParks: itParksResponse
      });

      if (citiesResponse.error) throw new Error(citiesResponse.error.message);
      if (itParksResponse.error) throw new Error(itParksResponse.error.message);

      return {
        cities: citiesResponse.data,
        itParks: itParksResponse.data,
      };
    } catch (error) {
      console.error('Fetch error:', error);
      return rejectWithValue("Data fetch failed: " + error.message);
    }
  }
);

const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    selectComplex: (state, action) => {
      state.selectedComplex = action.payload;
    },
    selectPriceSort: (state, action) => {
      state.priceSort = action.payload;
    },
    selectDistanceFilter: (state, action) => {
      state.distanceFilter = action.payload;
    },
    resetFilters: (state) => {
      state.selectedComplex = "";
      state.priceSort = "";
      state.distanceFilter = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParkingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParkingData.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload.cities;
        state.itParks = action.payload.itParks;
      })
      .addCase(fetchParkingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  selectComplex,
  selectPriceSort,
  selectDistanceFilter,
  resetFilters,
} = parkingSlice.actions;
export default parkingSlice.reducer;
