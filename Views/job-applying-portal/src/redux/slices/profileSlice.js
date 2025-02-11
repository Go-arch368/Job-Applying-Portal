import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../Config/axios";

export const getProfile = createAsyncThunk("/profile/getProfile",async({id},{rejectWithValue})=>{
    try{
        const response = await axios.get(`/api/candidate/${id}`,{headers:{Authorization:localStorage.getItem("token")}})
        console.log(response.data)
        return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

const profileReducer = createSlice({
    name:"profile",
    initialState:{
        data:[],
        serverError:null
    },
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(getProfile.fulfilled,(state,action)=>{
            state.data=action.payload
            state.serverError=null
        })
        builder.addCase(getProfile.rejected,(state,action)=>{
            state.serverError=null
            state.data=null
        })
    }
})


export default  profileReducer.reducer