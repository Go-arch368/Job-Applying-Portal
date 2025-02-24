import { createAsyncThunk,createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "../Config/axios";

export const sendQuery = createAsyncThunk("/support/sendQuery",async({jobId,query},{rejectedWithValue})=>{
    try{
       const response = await axios.post("/api/raise-query",{jobId,query},{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data)
       return response.data
    }
    catch(err){
       console.log(err.response.data.error)
       return rejectedWithValue(err.response.data.error)
    }
})

export const getQuery = createAsyncThunk("/support/getQuery",async({jobId},{rejectedWithValue})=>{
    try{
       const response = await axios.get(`/api/candidate-response/${jobId}`,{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data)
       return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectedWithValue(err.response.data.error)
    }
})

export const recruiterqueries = createAsyncThunk("/support/recruiterqueries",async(_,{rejectedWithValue})=>{
    try{
         const response = await axios.get("/api/recruiter-queries",{headers:{Authorization:localStorage.getItem("token")}})
         console.log(response.data)
         return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectedWithValue(err.response.data.error)
    }
})

export const responsePost = createAsyncThunk("/support/responsePost",async({id,response},{rejectedWithValue})=>{
    try{
        const res = await axios.post("/api/reply-query",{id,response},{headers:{Authorization:localStorage.getItem("token")}})
        console.log(res.data)
        return res.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectedWithValue(err.response.data.error)
    }
})

const supportSlice = createSlice({
    name:"support",
    initialState:{
        data:[],
        post:[],
        serverErrors:null,
        recruiterquery:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
       builder.addCase(sendQuery.fulfilled,(state,action)=>{
        state.post = action.payload
        state.serverErrors = null
       })
       builder.addCase(sendQuery.rejected,(state,action)=>{
        state.post = action.payload
        state.serverErrors = null
       })
       builder.addCase(getQuery.fulfilled,(state,action)=>{
        state.data = action.payload; 
        state.serverErrors = null
      })
      builder.addCase(getQuery.rejected,(state,action)=>{
       state.data = []
       state.serverErrors = action.payload
      })
      builder.addCase(recruiterqueries.fulfilled,(state,action)=>{
        state.recruiterquery=action.payload
        state.serverErrors = null
      })
      builder.addCase(recruiterqueries.rejected,(state,action)=>{
        state.recruiterquery = []
        state.serverErrors =action.payload
      })
      builder.addCase(responsePost.fulfilled,(state,action)=>{
        state.post =action.payload
        state.serverErrors = null
      })
      builder.addCase(responsePost.rejected,(state,action)=>{
        state.post = []
        state.serverErrors = action.payload
      })
    }
})


export default supportSlice.reducer