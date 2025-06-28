import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStoreOwnerOrders = createAsyncThunk(
  "storeOwnerOrders/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().storeOwnerAuth.token;
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/store-owner/my-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

const storeOwnerOrderSlice = createSlice({
  name: "storeOwnerOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreOwnerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreOwnerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchStoreOwnerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storeOwnerOrderSlice.reducer;