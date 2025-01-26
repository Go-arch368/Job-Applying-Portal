import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "../Config/axios.js"

export const userRegister = createAsyncThunk("users/userRegister",async({users,resetForm})=>{
    try{
        const response = await axios.post("/api/users",users)
        console.log(response.data)
    }
    catch(err){
        console.log(err)
    }
   
})

const usersSlice = createSlice({
    name:"users",
    initialState:{
        isloggedIn:false,
        user:null,
        serverErrors:null
    },
    reducers:{

    }
})

export default usersSlice.reducer