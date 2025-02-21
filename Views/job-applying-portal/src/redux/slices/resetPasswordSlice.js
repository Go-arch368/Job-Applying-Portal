import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "../Config/axios"

export const resetPasswordWithOldPassword =createAsyncThunk('resetPassword/resetPasswordWithOldPassword',async({email,oldPassword,newPassword},{rejectWithValue})=>{
    try{
        const response = await axios.post("/api/resetPassword",{email,oldPassword,newPassword})
        console.log(response.data)
        return response.data
    }
    catch(err){
        console.log(err.response.data.error)
        return rejectWithValue(err.response.data.error)
    }
})

const resetPasswordSlice = createSlice({
    name:"resetPassword",
    initialState:{isLoading:null,success:false,error:null},
    reducers:{
        resetState:(state,action)=>{
            state.isLoading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(resetPasswordWithOldPassword.pending,(state,action)=>{
            state.isLoading=true
            state.success=false
            state.error=null
        })
        builder.addCase(resetPasswordWithOldPassword.fulfilled,(state,action)=>{
            state.isLoading = false
            state.success = true
        })
        builder.addCase(resetPasswordWithOldPassword.rejected,(state,action)=>{
            state.success = false
            state.isLoading = false;
            state.error = action.payload
        })
    }
})

export const {resetState} = resetPasswordSlice.actions           
export default resetPasswordSlice.reducer