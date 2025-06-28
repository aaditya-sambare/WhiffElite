import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/stats`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

const adminStatsSlice = createSlice({
  name: "adminStats",
  initialState: {
    customerCount: 0,
    captainCount: 0,
    storeOwnerCount: 0,
    rideCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.customerCount = action.payload.customerCount;
        state.captainCount = action.payload.captainCount;
        state.storeOwnerCount = action.payload.storeOwnerCount;
        state.rideCount = action.payload.rideCount;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adminStatsSlice.reducer;