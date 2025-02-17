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

export const updateProfile = createAsyncThunk("profile/updateProfile",async({id,profile},{rejectWithValue,dispatch})=>{
    try{
        console.log("hi",profile)
        const response = await axios.put(`/api/candidate/${id}`,profile,{headers:{Authorization:localStorage.getItem("token")}})
        console.log(response.data)
        dispatch(getProfile({id}))
        return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

export const uploadProfilePicture = createAsyncThunk("profile/uploadProfilePicture",async({profilePic},{rejectWithValue})=>{
    try{
        const formData = new FormData()
        formData.append("profilePicture",profilePic)
        const response = axios.post("/api/candidate/upload-profile",formData,{headers:{"Content-Type":"multipart/form-data",Authorization:localStorage.getItem("token")}})
        console.log(response.data.profilePicture)
        return response.data.profilePicture
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

export const uploadResume = createAsyncThunk("profile/uploadResume",async({resume},{rejectWithValue})=>{
    try{
        const formData = new FormData()
        formData.append("resume",resume)
        const response = await axios.post("/api/candidate",formData,{headers:{"Content-Type":"multipart/form-data",Authorization:localStorage.getItem("token")}})
        console.log(response.data.resumeUrl);
        return response.data.resumeUrl; 
        
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

const profileReducer = createSlice({
    name:"profile",
    initialState:{
        data:{},
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
            state.serverError=action.payload
            state.data=null
        })
        builder.addCase(updateProfile.fulfilled,(state,action)=>{
            state.data={...state.data,...action.payload}
            state.serverError=null
        })
        builder.addCase(updateProfile.rejected,(state,action)=>{
            state.serverError=action.payload   
        })
        builder.addCase(uploadProfilePicture.fulfilled,(state,action)=>{
            state.data={...state.data,profilePicture:action.payload}
        })
        builder.addCase(uploadProfilePicture.rejected,(state,action)=>{
            state.serverError=action.payload
            state.data={}
        })
        builder.addCase(uploadResume.fulfilled, (state, action) => {
            state.data = { ...state.data, resumeUpload: action.payload };
        });
        builder.addCase(uploadResume.rejected, (state, action) => {
            state.serverError = action.payload;
        });
    }
})


export default  profileReducer.reducer