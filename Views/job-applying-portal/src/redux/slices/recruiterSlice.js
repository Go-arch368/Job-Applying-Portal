import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "../Config/axios"



export const recruiterData =createAsyncThunk("recruiter/recruiterData",async({recruiterDetails,resetForm},{rejectWithValue})=>{
   try{
     
      const response = await axios.post("/api/recruiter",recruiterDetails,{
        headers:{Authorization:localStorage.getItem("token")}
      })
      console.log(localStorage.getItem("token"))
      console.log(response.data)
      resetForm()
     
      return response.data
   }
   catch(err){
     console.log(err)
   }
}) 


const recruiterSlice = createSlice({
    name:"recruiter",
    initialState:{
        data:null,
        editId:null,
        serverErrors:null
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
    }
})

export default recruiterSlice.reducer