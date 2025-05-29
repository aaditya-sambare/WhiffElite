// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchCaptainProfile = createAsyncThunk(
//   "captain/fetchProfile",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().captainAuth.token;
//       const res = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/captains/profile`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch profile"
//       );
//     }
//   }
// );

// export const toggleCaptainOnline = createAsyncThunk(
//   "captain/toggleOnline",
//   async (isOnline, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().captainAuth.token;
//       const res = await axios.put(
//         `${process.env.REACT_APP_BACKEND_URL}/api/captains/online`,
//         { isOnline },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return res.data.isOnline;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update status"
//       );
//     }
//   }
// );

// // Add to your slice as needed
