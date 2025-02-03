import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../Config/axios";


export const searchingJobs = createAsyncThunk(
  "/jobapplying/searchingJobs",
  async ({ jobtitle, location }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/job", {
        params: { jobtitle, location },
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);


const jobapplyReducer = createSlice({
  name: "jobapplying",
  initialState: {
    data: [], 
    serverError: null, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchingJobs.fulfilled, (state, action) => {
        state.data = action.payload; 
        state.serverError = null;
      })
      .addCase(searchingJobs.rejected, (state, action) => {
      
        state.serverError = action.payload.response.data;
        state.data = null; // Clear job data
      });
  },
});

export default jobapplyReducer.reducer;
