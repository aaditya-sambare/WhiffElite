import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Retrieve user and captain info and token from localStorage
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const captainFromStorage = localStorage.getItem("captainInfo")
  ? JSON.parse(localStorage.getItem("captainInfo"))
  : null;

const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
  user: userFromStorage,
  captain: captainFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
  token:
    localStorage.getItem("userToken") ||
    localStorage.getItem("captainToken") ||
    null,
};

// Captain Registration
export const registerCaptain = createAsyncThunk(
  "auth/registerCaptain",
  async (captainData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/captains/register`,
        captainData,
        { withCredentials: true }
      );
      localStorage.setItem(
        "captainInfo",
        JSON.stringify(response.data.captain)
      );
      localStorage.setItem("captainToken", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Captain Login
export const loginCaptain = createAsyncThunk(
  "auth/loginCaptain",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/captains/login`,
        credentials,
        { withCredentials: true }
      );

      // Check if the user is really a captain
      if (!response.data.captain) {
        return rejectWithValue(
          "You are not authorized to log in as a captain."
        );
      }

      localStorage.setItem(
        "captainInfo",
        JSON.stringify(response.data.captain)
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user)); // Also store user
      localStorage.setItem("captainToken", response.data.token);

      return {
        captain: response.data.captain,
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// User Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        userData
      );

      // Check if the logged-in user is a regular user (not a captain)
      if (response.data.captain) {
        return rejectWithValue("You are not authorized to log in as a user.");
      }

      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// User Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Captain Profile
export const fetchCaptainProfile = createAsyncThunk(
  "auth/fetchCaptainProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/captains/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Toggle Captain Online Status
export const toggleCaptainOnline = createAsyncThunk(
  "auth/toggleCaptainOnline",
  async (isOnline, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/captains/online`,
        { isOnline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.isOnline;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// Update User Location
export const updateUserLocation = createAsyncThunk(
  "auth/updateUserLocation",
  async ({ lat, lng, token }, { rejectWithValue }) => {
    try {
      // Reverse geocode
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const locationName = data.display_name;

      // Update backend
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/location`,
        {
          location: {
            type: "Point",
            coordinates: [lng, lat],
            name: locationName,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.location;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.captain = null;
      state.token = null;
      state.error = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.removeItem("captainInfo");
      localStorage.removeItem("captainToken");
      localStorage.setItem("guestId", state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN USER
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

       
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "User login failed";
      })

      // REGISTER USER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "User registration failed";
      })

      // REGISTER CAPTAIN
      .addCase(registerCaptain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCaptain.fulfilled, (state, action) => {
        state.loading = false;
        state.captain = action.payload.captain;
        state.token = action.payload.token;
      })
      .addCase(registerCaptain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Captain registration failed";
      })

      // LOGIN CAPTAIN
      .addCase(loginCaptain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCaptain.fulfilled, (state, action) => {
        state.loading = false;
        state.captain = action.payload.captain;
        state.user = action.payload.user; // ✅ Also update user
        state.token = action.payload.token;
      })
      .addCase(loginCaptain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Captain login failed";
      })

      // FETCH CAPTAIN PROFILE
      .addCase(fetchCaptainProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaptainProfile.fulfilled, (state, action) => {
        state.captain = action.payload;
      })
      .addCase(fetchCaptainProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TOGGLE CAPTAIN ONLINE STATUS
      .addCase(toggleCaptainOnline.fulfilled, (state, action) => {
        if (state.captain) {
          state.captain.isOnline = action.payload;
        }
      })

      // UPDATE USER LOCATION
      .addCase(updateUserLocation.fulfilled, (state, action) => {
        if (state.user) {
          state.user.location = action.payload;
          localStorage.setItem("userInfo", JSON.stringify(state.user));
        }
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
