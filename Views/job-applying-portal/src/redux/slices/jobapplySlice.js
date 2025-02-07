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
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
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
    console.log(err.response.data)
    return rejectWithValue(err.response.data.message)
  }
})

export const validateCandidates = createAsyncThunk("jobapplying/validateCandidates",async({id,status},{rejectWithValue})=>{
  try{
     const response = await axios.put(`/api/job/verify/${id}`,{status},{headers:{Authorization:localStorage.getItem("token")}})
     console.log(response.data)
     return response.data
  }
  catch(err){
    console.log(err)
    return rejectWithValue(err.response)
  }
})

export const getAccepted = createAsyncThunk("jobapplying/getAccepted",async({jobId},{rejectWithValue})=>{
  try{
    const response = await axios.get(`/api/job/${jobId}/accepted`,{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data)
    return response.data
  }
  catch(err){
    console.log(err)
    return rejectWithValue(err.response.data.error)
  }
})

export const getRejected = createAsyncThunk("jobapplying/getRejected",async({jobId},{rejectWithValue})=>{
  try{
    const response = await axios.get(`/api/job/${jobId}/rejected`,{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data)
    return response.data
  }
  catch(err){
    console.log(err)
    return rejectWithValue(err.response.data.error)
  }
})

export const getApplied = createAsyncThunk("/jobapplying/getapplied",async(_,{rejectWithValue})=>{
  try{
     const response = await axios.get("/api/applied/jobs",{headers:{Authorization:localStorage.getItem("token")}})
     console.log(response.data)
     return response.data
  }
  catch(err){
    console.log(err.response.data.error)
    return rejectWithValue(err.response.data.error)
  }
})

const jobapplyReducer = createSlice({
  name: "jobapplying",
  initialState: {
    data: [], // 🔹 Ensure `data` is an array
    applying: [],
    accepted:[],//user for search and applying a job
    rejected:[],
    applied:[],
    //updatingCandidates:[],
    serverError: null,
    searchError:null,
    isloading:false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchingJobs.fulfilled, (state, action) => {
        state.data = action.payload;
        state.searchError = null;
        state.applying=[]
      })  
      .addCase(searchingJobs.rejected, (state, action) => {
        state.searchError = action.payload;
        state.data = [];
        state.applying=[]
      })
      .addCase(applyingjob.pending,(state,action)=>{
        state.isloading=true
      })
      .addCase(applyingjob.fulfilled, (state, action) => {
        state.applying = action.payload;
        state.isloading=false
        state.serverError = null;
        state.data=[]
      })
      .addCase(applyingjob.rejected, (state, action) => {
        state.serverError = action.payload;
        state.applying = [];
        state.isloading=false
        state.data=[]
      })
      .addCase(getCandidates.fulfilled,(state,action)=>{
        state.data=action.payload
        state.serverError = null
        state.applying=[]
      })
      .addCase(getCandidates.rejected,(state,action)=>{
        state.serverError=action.payload
        state.data=[]
        state.applying=[]
      })
      .addCase(validateCandidates.fulfilled,(state,action)=>{
        // if(action.payload.status=="accepted"){
        //   const updateData = state.data.findIndex((ele)=>ele._id==action.payload._id)
        //   state.data[updateData] = action.payload
        //    state.serverError=null
        //    state.applying=[]
        // }
        // else if(action.payload.status=="rejected"){
        //   const deleteData =state.data.filter((ele)=>ele._id!=action.payload._id)
        //   state.data =deleteData
        //   state.serverError= null
        //   state.applying=[]
        // }
        const findingData = state.data.findIndex((ele)=>ele._id===action.payload._id)
        state.data[findingData]=action.payload
        state.serverError=null
        state.applying=[]
      })
    .addCase(validateCandidates.rejected,(state,action)=>{
       state.serverError=action.payload
       state.data=[]
       state.applying=[]
    }) 
    .addCase(getAccepted.fulfilled,(state,action)=>{
      state.accepted = action.payload
      state.serverError=null
    
      state.applying=[]
    })
    .addCase(getAccepted.rejected,(state,action)=>{
      state.serverError = action.payload
      state.data=[]
      state.accepted=[]
      state.applying=[]
    })
    .addCase(getRejected.fulfilled,(state,action)=>{
      state.rejected=action.payload
      state.serverError=null
      state.applying=[]
    })
    .addCase(getRejected.rejected,(state,action)=>{
      state.serverError = action.payload
      state.rejected = []
      state.applying=[]
      state.data=[]
    })
    .addCase(getApplied.fulfilled,(state,action)=>{
      state.applied = action.payload
      state.data=[]
      state.applying=[]
      state.accepted=[]
      state.serverError=null
    })
    .addCase(getApplied.rejected,(state,action)=>{
      state.serverError=action.payload
      state.data=[]
      state.applying=[]
      state.applied=[]
    })
  }
})



export default jobapplyReducer.reducer;
