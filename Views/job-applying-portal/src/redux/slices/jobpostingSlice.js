import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../Config/axios";

// Async action to post a job
export const postjob = createAsyncThunk(
    "jobposting/postjob",
    async ({ jobDetails, resetForm ,navigate }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "/api/jobposting",
                jobDetails,
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            resetForm()
            const jobId = response.data._id
            navigate(`/create-questions/${jobId}`)
            console.log(response.data)
            return response.data;
          
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const displayJobs = createAsyncThunk("/jobposting/displayJobs",async(_,{rejectWithValue})=>{
     try{
       const response = await axios.get("/api/jobs",{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data)
       return response.data
     }
     catch(err){
        console.log(err)
        return rejectWithValue(err)
     }
})

export const updateJobDetails = createAsyncThunk("/jobposting/updateJobDetails",async({editJobId,jobDetails,navigate},{rejectWithValue})=>{
    try{
       const response = await axios.put(`/api/jobs/${editJobId}`,jobDetails,{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data)
       navigate("/jobposted")
       return response.data
    }
    catch(err){
        console.log(err)
        return rejectWithValue(err)
    }
})

export const deletingJob =createAsyncThunk("/jobposting/deletingJob",async({id},{rejectWithValue})=>{
    try{
      const response = await axios.delete(`/api/jobs/${id}`,{headers:{Authorization:localStorage.getItem("token")}})
      console.log(response.data)
      return response.data
    }
    catch(err){
      console.log(err)
      return rejectWithValue(err)
    }
})

// Job posting reducer
const jobpostingReducer = createSlice({
    name: "jobposting",
    initialState: {
        data: [],
        serverErrors: null,
        editJobId:null
    },
    reducers: {
      setEditJobId:(state,action)=>{
        state.editJobId =action.payload
      }
    },
    extraReducers: (builder) => {
        builder
            .addCase(postjob.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.serverErrors=null
            })
            .addCase(postjob.rejected, (state, action) => {
                state.serverErrors = action.payload;
            })
            .addCase(displayJobs.fulfilled,(state,action)=>{
                state.data=action.payload
                state.serverErrors=null
            })
            .addCase(displayJobs.rejected,(state,action)=>{
                state.serverErrors=action.payload
                state.data=null
            })
            .addCase(updateJobDetails.fulfilled,(state,action)=>{
                const index = state.data.findIndex((ele)=>ele._id===action.payload._id)
                state.data[index] = action.payload
                state.editJobId=null
            })
           .addCase(updateJobDetails.rejected,(state,action)=>{
               state.serverErrors =action.payload
               state.data=null
           })
           .addCase(deletingJob.fulfilled,(state,action)=>{
              const deleteDocument = state.data.filter((ele)=>ele._id!==action.payload._id)
              state.data=deleteDocument
              state.serverErrors=null
           })
           .addCase(deletingJob.rejected,(state,action)=>{
              state.serverErrors=action.payload
              state.data=null
           })
    }
});
export const {setEditJobId} = jobpostingReducer.actions
export default jobpostingReducer.reducer;
