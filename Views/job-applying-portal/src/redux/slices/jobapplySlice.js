import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../Config/axios";



export const searchingJobs = createAsyncThunk( "jobapplying/searchingJobs", async ({ jobtitle, location }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/job", {
        params: { jobtitle, location }
        // headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data);
    }
  }
);

 export const withOutSearch = createAsyncThunk("jobapplying/withOutSearch",async(_,{rejectWithValue})=>{
   try{
     const response = await axios.get("/api/jobs/noSearch",{headers:{Authorization:localStorage.getItem("token")}})
     console.log(response?.data.gettingQuestions)
     return response.data.gettingQuestions
   }
   catch(err){
    console.log(err)
    return rejectWithValue(err.response?.data)
   }
})

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
    return rejectWithValue(err.response.data)
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
    console.log(err?.response?.data?.error)
    return rejectWithValue(err?.response?.data?.error)
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

export const getApplied = createAsyncThunk("/jobapplying/getapplied",async({search,sortby,order,page,limit},{rejectWithValue})=>{
  try{
     const params={}
     if(search)params.search =search
     if(sortby)params.sortby = sortby
     if(order)params.order=order
     if(page)params.page=page
     if(limit)params.limit=limit

     const response = await axios.get("/api/applied/jobs",{
      params:Object.keys(params).length?params:undefined,
      headers:{
        Authorization:localStorage.getItem("token")
      }
     })
     console.log(response.data)
     return response.data
  }
  catch(err){
    console.log(err.response.data.error)
    return rejectWithValue(err.response.data.error)
  }
})

export const fetchCalendarInterviews = createAsyncThunk("/jobapplying/fetchCalendarInterviews",async(_,{rejectWithValue})=>{
  try{
    const response = await axios.get("/api/scheduled/interviews",{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data)
    return response.data
  }
  catch(err){
    console.log(err)
    return rejectWithValue(err.response.data.error)
  }
})

export const saveJobs = createAsyncThunk("/jobapplying/saveJobs",async({id},{rejectWithValue,dispatch})=>{
  try{
    const response = await axios.post("/api/candidate/saved-jobs",{jobId:id},{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data)
    dispatch(getSaved())
    return response.data  
  }
  catch(err){
    console.log(err?.response?.data?.error)
    return rejectWithValue(err?.response?.data?.error)
  }
})

export const getSaved = createAsyncThunk("/jobapplying/getSaved",async(_,{rejectWithValue})=>{
  try{
    const response = await axios.get("/api/savedjobs",{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data)
    return response.data
  }
  catch(err){
    console.log(err?.response?.data?.error)
    return rejectWithValue(err?.response?.data?.error)
  }
})

export const unSaveJobs = createAsyncThunk("/jobapplying/unSaveJobs",async({id},{rejectWithValue})=>{
  try{
     const response = await axios.delete(`/api/candidate/saved-jobs/${id}`,{headers:{Authorization:localStorage.getItem("token")}})
     console.log(response.data,id)
     return id

  }
  catch(err){
    console.log(err?.response?.data?.error)
    return rejectWithValue(err?.response?.data?.error)
  }
})

export const getTotalApplied = createAsyncThunk("/jobapplying/getTotalApplied",async(_,{rejectWithValue})=>{
  try{
       const response = await axios.get("/api/getAllApplied",{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data);
       return response.data
       
  }
  catch(err){
    console.log(err?.response?.data?.error)
    return rejectWithValue(err?.response?.data?.error)
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
    interviews:[],
    interviewError:null,
    //updatingCandidates:[],
    serverError: null,
    searchError:null,
    isloading:false,
    savedJobs:[],
    savedError:null,
    getAppliedCandidate:[]
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
      .addCase(withOutSearch.fulfilled, (state, action) => {
        state.data = action.payload;
        state.searchError = null;
        state.applying=[]
      })  
      .addCase(withOutSearch.rejected, (state, action) => {
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
        state.data=[]
        state.serverError = null
        state.searchError=null
        state.interviewError=null
        state.serverError = null;
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
    .addCase(fetchCalendarInterviews.fulfilled,(state,action)=>{
       state.interviews=action.payload
       state.interviewError=null
    })
    .addCase(fetchCalendarInterviews.rejected,(state,action)=>{
      state.interviewError = action.payload
      state.interviews=null
    })
    .addCase(saveJobs.pending,(state,action)=>{
      state.isloading=true
    })
    .addCase(saveJobs.fulfilled,(state,action)=>{
      state.savedJobs = [...state.savedJobs,action.payload]
      state.isloading = false
      state.savedError = null
    })
    .addCase(saveJobs.rejected,(state,action)=>{
       state.savedError = action.payload
       state.isloading = false
       state.savedJobs = null
    })
    .addCase(getSaved.fulfilled,(state,action)=>{
       state.savedJobs = action.payload
       state.savedError = null
    })
    .addCase(getSaved.rejected,(state,action)=>{
      state.savedError = action.payload
      state.savedJobs = null
    })
    .addCase(unSaveJobs.fulfilled,(state,action)=>{
      const deletingId = state.savedJobs.filter((ele)=>ele._id!==action.payload)

      state.savedJobs = deletingId
    })
    .addCase(unSaveJobs.rejected,(state,action)=>{
       state.savedError = action.payload
    })
    .addCase(getTotalApplied.fulfilled,(state,action)=>{
       state.getAppliedCandidate = action.payload
       state.searchError = null
    })
    .addCase(getTotalApplied.rejected,(state,action)=>{
       state.searchError = action.payload
       state.getAppliedCandidate = []
    })
  }
})



export default jobapplyReducer.reducer;
