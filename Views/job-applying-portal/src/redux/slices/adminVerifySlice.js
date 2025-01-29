import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../Config/axios";

export const getRecruiters = createAsyncThunk(
  "adminVerify/getRecruiters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/verify/recruiter", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching recruiters");
    }
  }
);

export const updateVerificationStatus = createAsyncThunk(
  "adminVerify/updateVerificationStatus",
  async ({ _id, isVerified }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/verify/recruiter/${_id}`, { isVerified }, { headers: { Authorization: localStorage.getItem("token") } } );
        console.log(response.data)
      return response.data 
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error updating status");
    }
  }
);

export const deleteRecruiter = createAsyncThunk("adminVerify/deleteRecruiter",async({_id},{rejectWithValue})=>{
    try{
        const response = await axios.delete(`/api/delete/recruiter/${_id}`,{headers:{Authorization:localStorage.getItem("token")}})
        console.log(response.data)
        return response.data
    }
    catch(err){
        console.log(err)
        return rejectWithValue(err)
    }
  
})

const adminVerifyReducer = createSlice({
  name: "adminVerify",
  initialState: {
    data: [],
    serverErrors: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecruiters.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(getRecruiters.rejected, (state, action) => {
        state.serverErrors = action.payload;
      })
      .addCase(updateVerificationStatus.fulfilled, (state, action) => {
        state.data = state.data.map((ele) => 
          ele._id === action.payload._id ? action.payload : ele
        );
      })
      .addCase(updateVerificationStatus.rejected, (state, action) => {
        state.serverErrors = action.payload;
      })
      .addCase(deleteRecruiter.fulfilled,(state,action)=>{
        state.data = state.data.filter((ele)=>ele._id!==action.payload._id)
      })
      .addCase(deleteRecruiter.rejected,(state,action)=>{
        state.serverErrors = action.payload
        state.data=null
      })
    
  },
});

export default adminVerifyReducer.reducer;
