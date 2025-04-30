import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";


//retrieve user info adn token from localstorage if avl
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

//check for an existing guest id in the local storage or generate a new one
const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

//inistal state
const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

//async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectedWithValue }) => {
    try {
      console.log("Sending login request with:", userData); // Debug log
      console.log(process.env.REACT_APP_BACKEND_URL); // Should log: http://localhost:9000

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        userData
      );

      console.log("Login response:", response); // Log the response to see if it reaches here
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user;
    } catch (error) {
      console.error("Login error:", error); // Log error if any
      return rejectedWithValue(error.response?.data || error.message);
    }
  }
);


//async thunk for user register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectedWithValue }) => {
    try {
       const response = await axios.post(
         `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
         userData
       );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return response.data.user;
    } catch (error) {
      return rejectedWithValue(error.response.data);
    }
  }
);

//SLICE
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "An error occurred during login"; // Fallback message
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "An error occurred during registration"; // Fallback message
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
