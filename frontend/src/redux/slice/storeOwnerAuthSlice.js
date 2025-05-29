import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const registerStoreOwner = createAsyncThunk(
  "storeOwner/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/store-owner/register`,
        data
      );
      localStorage.setItem("storeOwnerInfo", JSON.stringify(res.data.user));
      localStorage.setItem("storeOwnerToken", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginStoreOwner = createAsyncThunk(
  "storeOwner/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/store-owner/login`,
        data
      );
      localStorage.setItem("storeOwnerInfo", JSON.stringify(res.data.user));
      localStorage.setItem("storeOwnerToken", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const fetchStoreOwnerProfile = createAsyncThunk(
  "storeOwner/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().storeOwnerAuth.token;
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/store-owner/profile`,
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

export const toggleStoreOnline = createAsyncThunk(
  "storeOwner/toggleStoreOnline",
  async ({ storeId, isActive }, { getState, rejectWithValue }) => {
    try {
      const token = getState().storeOwnerAuth.token;
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/store-owner/store/${storeId}/online`,
        { isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.isActive;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);



const storeOwnerAuthSlice = createSlice({
  name: "storeOwnerAuth",
  initialState: {
    user: JSON.parse(localStorage.getItem("storeOwnerInfo")) || null,
    token: localStorage.getItem("storeOwnerToken") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutStoreOwner: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("storeOwnerInfo");
      localStorage.removeItem("storeOwnerToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerStoreOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStoreOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerStoreOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginStoreOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStoreOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginStoreOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStoreOwnerProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("storeOwnerInfo", JSON.stringify(action.payload));
      });
  },
});

export const { logoutStoreOwner } = storeOwnerAuthSlice.actions;
export default storeOwnerAuthSlice.reducer;
