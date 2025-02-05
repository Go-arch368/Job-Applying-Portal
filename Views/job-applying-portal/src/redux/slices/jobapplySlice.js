import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../Config/axios";

export const searchingJobs = createAsyncThunk( "jobapplying/searchingJobs", async ({ jobtitle, location }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/job", {
        params: { jobtitle, location },
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs");
    }
  }
);

export const applyingjob = createAsyncThunk( "jobapplying/applyingjob", async ({ jobId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/apply/${jobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to apply");
      return rejectWithValue(err.response?.data?.message || "Failed to apply");
    }
  }
);

export const getCandidates = createAsyncThunk("jobapplying/getCandidates",async({jobId},{rejectWithValue})=>{
  try{
    console.log(jobId)
    const response = await axios.get(`/api/job/${jobId}/applicants`,{
      headers:{Authorization:localStorage.getItem("token")}
    })
    console.log(response.data)
    return response.data
  }
  catch(err){
    console.log(err)
    return rejectWithValue(err)
  }
})

const jobapplyReducer = createSlice({
  name: "jobapplying",
  initialState: {
    data: [], // 🔹 Ensure `data` is an array
    applying: [],
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
        state.serverError = action.payload;
        state.data = []; // 🔹 Set `data` to `[]` instead of `null`
      })
      .addCase(applyingjob.fulfilled, (state, action) => {
        state.applying = action.payload;
        state.serverError = null;
      })
      .addCase(applyingjob.rejected, (state, action) => {
        state.serverError = action.payload;
        state.applying = [];
      });
  },
});

export default jobapplyReducer.reducer;
