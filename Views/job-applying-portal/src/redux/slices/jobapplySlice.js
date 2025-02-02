import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../Config/axios";

// Async action for searching jobs
export const searchingJobs = createAsyncThunk(
  "/jobapplying/searchingJobs",
  async ({ jobtitle, location }, { rejectWithValue }) => {
    try {
      // Sending GET request with jobtitle and location as query params
      const response = await axios.get("/api/job", {
        params: { jobtitle, location },
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      // Handle error and return the rejected value with the error details
      return rejectWithValue(err);
    }
  }
);

// Reducer for managing job application state
const jobapplyReducer = createSlice({
  name: "jobapplying",
  initialState: {
    data: [], // Stores the job data
    serverError: null, // Stores error message if server fails
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchingJobs.fulfilled, (state, action) => {
        state.data = action.payload; // Store the job data
        state.serverError = null; // Reset any previous error
      })
      .addCase(searchingJobs.rejected, (state, action) => {
        // Extract error message from the action payload and store it
        state.serverError = action.payload.response.data;
        state.data = null; // Clear job data
      });
  },
});

export default jobapplyReducer.reducer;
