import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../Config/axios";


export const createEvent = createAsyncThunk("/jobFair/createEvent",async({formData},{rejectWithValue})=>{
    try{
       const response = await axios.post("/api/create-jobFair",formData,{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data)
       return response.data
    }
    catch(err){
        console.log(err.response.data)
        return rejectWithValue(err)
    }
})

export const getAll = createAsyncThunk("/jobFair/getAll",async(_,{rejectWithValue})=>{
    try{
        const response = await axios.get("/api/jobFair",{headers:{Authorization:localStorage.getItem("token")}})
        console.log(response.data)
        return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

export const updateEvent = createAsyncThunk("/jobFair/updateEvent",async({formData,editId,navigate},{rejectWithValue})=>{
    try{
       const response = await axios.put(`/api/${editId}/jobFairs`,formData,{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data)
       navigate("/managejobfair")
       return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

export const deleteEvent = createAsyncThunk("/jobFair/deleteEvent",async({id},{rejectWithValue})=>{
    try{
       const response = await axios.delete(`/api/${id}/jobFairs`,{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data)
       return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

export const recruiterRegister = createAsyncThunk("/jobFair/recruiterRegister",async({id,role},{rejectWithValue})=>{
    try{
        const response = await axios.post(`/api/recruiterpost`,{role,jobFairId:id},{headers:{Authorization:localStorage.getItem("token")}})
        console.log(response.data)
        return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

export const displayRegistered = createAsyncThunk("/jobFair/displayRegistered",async({id},{rejectWithValue})=>{
    try{
       const response = await axios.get(`/api/getregistered/${id}`,{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data)
       return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

export const candidatejobFair = createAsyncThunk("/jobFair/candidatejobFair",async({id},{rejectWithValue})=>{
    try{
       const response = await axios.post("/api/candidatepost",{jobFairId:id},{headers:{Authorization:localStorage.getItem("token")}})
       console.log(response.data)
       return response.data
    }
    catch(err){
        console.log(err?.response?.data?.error)
        return rejectWithValue(err?.response?.data?.error)
    }
})

const jobFairReducer = createSlice({
    name:"jobFair",
    initialState:{
        data:[],
        serverErrors:null,
        editId:null,
        recRegister:[],
        registeredAll:[],
        candidateRegistered:[],
        isLoading:false,
        candidateError:null
    },
    reducers:{
         jobFaireditId:(state,action)=>{
            state.editId=action.payload
         },
    },
    extraReducers:(builder)=>{
        builder.addCase(createEvent.fulfilled,(state,action)=>{
            state.data=action.payload
            state.serverErrors=null
        })
        builder.addCase(createEvent.rejected,(state,action)=>{
            state.serverErrors=action.payload
            state.data=[]
        })
        builder.addCase(getAll.fulfilled,(state,action)=>{
            state.data=action.payload
            state.serverErrors=null
        })
        builder.addCase(getAll.rejected,(state,action)=>{
            state.serverErrors=action.payload
            state.data=[]
        })
        builder.addCase(updateEvent.fulfilled,(state,action)=>{
            const updateValue = state.data.findIndex((ele)=>ele._id==action.payload._id)
            state.data[updateValue] = action.payload
            state.serverErrors=null
            state.editId=null
        })
        builder.addCase(updateEvent.rejected,(state,action)=>{
            state.serverErrors=null
            state.data=[]
        })
        builder.addCase(deleteEvent.fulfilled,(state,action)=>{
            const deleteData = state.data.filter((ele)=>ele._id!==action.payload._id)
            state.data=deleteData
            state.serverErrors=null
        })
        builder.addCase(deleteEvent.rejected,(state,action)=>{
            state.serverErrors=action.payload
            state.data=[]
        })
        builder.addCase(recruiterRegister.fulfilled,(state,action)=>{
            state.recRegister=action.payload
            state.serverErrors=null
        })
        builder.addCase(recruiterRegister.rejected,(state,action)=>{
            state.serverErrors=action.payload
            state.recRegister=[]
        })
        builder.addCase(displayRegistered.fulfilled,(state,action)=>{
            state.registeredAll=action.payload
            state.serverErrors=[]
        })
        builder.addCase(displayRegistered.rejected,(state,action)=>{
            state.serverErrors=action.payload
            state.registeredAll=[]
        })
        builder.addCase(candidatejobFair.pending,(state,action)=>{
            state.isLoading=true
        })
        builder.addCase(candidatejobFair.fulfilled,(state,action)=>{
            state.candidateRegistered=action.payload
            state.candidateError=null
            state.isLoading=false
        })
        builder.addCase(candidatejobFair.rejected,(state,action)=>{
           state.candidateError=action.payload
           state.candidateRegistered=[]
           state.isLoading=false
        })
    }
})
export const {jobFaireditId} =jobFairReducer.actions
export default jobFairReducer.reducer