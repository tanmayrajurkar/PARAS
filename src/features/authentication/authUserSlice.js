import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { supabase } from '../../lib/supabase';

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });

      if (error) throw error;

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        foundUser: {
          _id: data.user.id,
          email: data.user.email,
          name: profile.full_name,
          vehicleNumber: profile.vehicle_number,
          // Add other profile fields as needed
        },
        encodedToken: data.session.access_token
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) throw error;

      // Create profile entry
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: userData.email,
            full_name: userData.name,
            vehicle_number: userData.vehicleNumber,
          }
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        createdUser: {
          _id: data.user.id,
          email: data.user.email,
          name: userData.name,
        },
        encodedToken: data.session?.access_token
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const guestLoginUser = createAsyncThunk(
  "auth/guestLoginUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'guest@example.com', // Use your guest account email
        password: 'guest123', // Use your guest account password
      });

      if (error) throw error;

      return {
        foundUser: {
          _id: data.user.id,
          email: data.user.email,
          name: "Guest User",
        },
        encodedToken: data.session.access_token
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!session) return null;

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        foundUser: {
          _id: session.user.id,
          email: session.user.email,
          name: profile.full_name,
        },
        encodedToken: session.access_token
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authUserSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    error: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      toast.success("Logout Successfully");
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.foundUser;
        state.token = action.payload.encodedToken;
        state.loading = false;
        state.error = null;
        toast.success("logged in successfully");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        toast.error(action.payload || "Login failed");
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.createdUser;
        state.token = action.payload.encodedToken;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(guestLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(guestLoginUser.fulfilled, (state, action) => {
        state.user = action.payload.foundUser;
        state.token = action.payload.encodedToken;
        state.loading = false;
        state.error = null;
        toast.success("Logged in as Guest successfully");
      })
      .addCase(guestLoginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.foundUser;
          state.token = action.payload.encodedToken;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, clearErrors } = authUserSlice.actions;
export default authUserSlice.reducer;
