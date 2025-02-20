import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "../Config/axios"



export const recruiterData =createAsyncThunk("recruiter/recruiterData",async({recruiterDetails,resetForm,navigate},{rejectWithValue})=>{
   try{
     
      const response = await axios.post("/api/recruiter",recruiterDetails,{
        headers:{Authorization:localStorage.getItem("token")}
      })
      console.log(localStorage.getItem("token"))
      localStorage.removeItem("token")
      console.log(response.data)
      resetForm()
      navigate("/")
     
      return response.data
   }
   catch(err){
     console.log(err)
   }
}) 

export const recruiterProfile =createAsyncThunk("recruiter/recruiterProfile",async({id},{rejectWithValue})=>{
  try{
     const response = await axios.get(`/api/recruiter/${id}`,{headers:{Authorization:localStorage.getItem("token")}})
     console.log(response.data)
     return response.data
  }
  catch(err){
    console.log(err)
    return rejectWithValue(err.response.data.error)
  }
})

export const updateRecruiterFile = createAsyncThunk("recruiter/updateRecruiterFile",async({id,data},{rejectWithValue,dispatch})=>{
  try{
     console.log(data)
     const response = await axios.put(`/api/recruiter/${id}`,data,{headers:{Authorization:localStorage.getItem("token")}})
     console.log(response.data)
     dispatch(recruiterProfile({id}))
     return response.data
  }
  catch(err){
    console.log(err)
    return rejectWithValue(err)
  }
})

export const updateRecruiterUpload = createAsyncThunk("recruiter/updateRecruiterUpload",async({formData,id},{rejectWithValue,dispatch})=>{
  try{
    const response = await axios.post("/api/recruiter-profile",formData,{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data)
    dispatch(recruiterProfile({id}))
    return response.data
  }
  catch(err){
    console.log(err)
    return rejectWithValue(err)
  }
})

export const recruiterDetails = createAsyncThunk("recruiter/recruiterDetails",async(_,{rejectWithValue})=>{
  try{
    const response = await axios.get("/api/getrecruiter",{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data)
    return response.data
  }
  catch(err){
    console.log(err.response.data.error)
    return rejectWithValue(err.response.data.error)
  }
})

export const selectSubscription = createAsyncThunk("recrutier/selectSubscription",async({plan},{rejectWithValue})=>{
  try{
  const response = await axios.post("/api/subscribe",{plan},{headers:{Authorization:localStorage.getItem("token")}})
    console.log(response.data) 
    return response.data
  }
  catch(err){
    console.log(err)
    return rejectWithValue(err.response.data.error)
  }
})

const recruiterSlice = createSlice({
    name:"recruiter",
    initialState:{
        data:[],
        editId:null,
        serverErrors:null,
        profileData:{},
        profileErrors:null,
        recruiterData:{},
        recruiterError:null,
        sessionUrl:"",
        sessionError:null
    },
    reducers:{
        
    },
    extraReducers:(builder)=>{
         builder.addCase(recruiterData.fulfilled,(state,action)=>{
          return {...state,data:action.payload}
         })
         builder.addCase(recruiterData.rejected,(state,action)=>{
          return {...state,serverErrors:action.payload,data:null}
         })
         builder.addCase(recruiterProfile.fulfilled,(state,action)=>{
            state.profileData= action.payload
            state.profileErrors =null
         })
         builder.addCase(recruiterProfile.rejected,(state,action)=>{
            state.profileErrors = action.payload
            state.profileData = {}
         })
         builder.addCase(updateRecruiterFile.fulfilled,(state,action)=>{
          const filteringElements = state.profileData._id==action.payload._id
           state.profileErrors = filteringElements
         })
         builder.addCase(updateRecruiterFile.rejected,(state,action)=>{
          state.profileErrors = action.payload
          state.profileData={}
         })
         builder.addCase(recruiterDetails.fulfilled,(state,action)=>{
          state.recruiterData = action.payload
          state.recruiterError=null
         })
         builder.addCase(recruiterDetails.rejected,(state,action)=>{
           state.recruiterError = action.payload
           state.recruiterData = {}
         })
        builder.addCase(selectSubscription.fulfilled,(state,action)=>{
          state.sessionUrl = action.payload
          state.sessionError = null
        })
        builder.addCase(selectSubscription.rejected,(state,action)=>{
          state.sessionError=action.payload
          state.sessionUrl = null
        })
    }
})

export default recruiterSlice.reducer