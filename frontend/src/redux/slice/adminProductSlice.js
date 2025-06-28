import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


// Fetch all products (admin only)
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/products`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

// Async thunk to create a new product
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData) => {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/products`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

// Async thunk to update an existing product
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // create product
      .addCase(createProduct.fulfilled, (state, action) => {
        // Add the new product to the products array
        state.products.push(action.payload);
      })

      // Update product

      .addCase(updateProduct.fulfilled, (state, action) => {
        // Update the product in the products array
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      // Delete product

      .addCase(deleteProduct.fulfilled, (state, action) => {
        // Remove the deleted product from the products array
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      });
  },
});

export default adminProductSlice.reducer;


