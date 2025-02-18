import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../Config/axios";


export const getRecruiters = createAsyncThunk( "adminVerify/getRecruiters", async (_, { rejectWithValue }) => {
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

export const updateVerificationStatus = createAsyncThunk( "adminVerify/updateVerificationStatus",async ({ _id, isVerified }, { rejectWithValue }) => {
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

export const activeRecruiters = createAsyncThunk("adminVerify/activeRecruiters",async(_,{rejectWithValue})=>{
  try{
     const response = await axios.get("/api/admin/active-recruiters",{headers:{Authorization:localStorage.getItem("token")}})
     console.log(response.data)
     return response.data
  }
  catch(err){
    console.log(err.response.data.error)
    return rejectWithValue(err.response.data.error)
  }
})

export const candidates = createAsyncThunk("adminVerify/candidates",async(_,{rejectWithValue})=>{
  try{
     const response = await axios.get("/api/admin/total-candidates",{headers:{Authorization:localStorage.getItem("token")}})
     console.log(response.data);
     return response.data  
  }
  catch(err){
    console.log(err.response.data.error);
    return rejectWithValue(err.response.data.error)  
  }
})

export const recruiters = createAsyncThunk("adminVerify/recruiters",async(_,{rejectWithValue})=>{
  try{
    const response = await axios.get("/api/admin/total-recruiters",{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data);
    return response.data
  }
  catch(err){
    console.log(err.response.data.error);
    return rejectWithValue(err.response.data.error)
    
  }
})

export const applicationStatus = createAsyncThunk("adminVerify/appliationStatus",async(_,{rejectWithValue})=>{
  try{
    const response = await axios.get("/api/admin/application-status",{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data)
    return response.data
  }
  catch(err){
    console.log(err.response.data.error);
    return rejectWithValue(err.response.data.error)
  }
})


const adminVerifyReducer = createSlice({
  name: "adminVerify",
  initialState: {
    data: [],
    recruiterDetails:[],
    candidatesDetails:[],
    applicationDetails:[],
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
     .addCase(activeRecruiters.fulfilled,(state,action)=>{
        state.recruiterDetails = action.payload
        state.serverErrors = null
     })
     .addCase(activeRecruiters.rejected,(state,action)=>{
        state.serverErrors = action.payload
        state.recruiterDetails = null
     })
     .addCase(candidates.fulfilled,(state,action)=>{
       state.candidatesDetails = action.payload
       state.serverErrors = null
     })
     .addCase(candidates.rejected,(state,action)=>{
      state.serverErrors = action.payload
      state.candidatesDetails = null
     })
     .addCase(recruiters.fulfilled,(state,action)=>{
       state.recruiterDetails = action.payload
       state.serverErrors = null
     })
     .addCase(recruiters.rejected,(state,action)=>{
       state.serverErrors = action.payload
       state.recruiterDetails = []
     })
     .addCase(applicationStatus.fulfilled,(state,action)=>{
        state.applicationDetails = action.payload
        state.serverErrors=null
     })
     .addCase(applicationStatus.rejected,(state,action)=>{
        state.serverErrors=null
        state.applicationDetails= action.payload
     })
  },
});

export default adminVerifyReducer.reducer;
