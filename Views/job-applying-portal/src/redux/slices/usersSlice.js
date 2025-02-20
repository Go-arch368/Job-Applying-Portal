import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "../Config/axios.js"
//still needed to display the sever errors:
export const userRegister = createAsyncThunk("users/userRegister",async({users,resetForm},{rejectWithValue})=>{
    try{
        const response = await axios.post("/api/users",users)
            resetForm()
            console.log(response.data.token)
           localStorage.setItem("token",response.data.token)
           console.log(localStorage.getItem("token"))
            return response.data
    }
    catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
   } 
})

export const userLogin =createAsyncThunk("users/userLogin",async({users,resetForm,navigate},{dispatch,rejectWithValue})=>{
    try{
      const response = await axios.post("/api/login",users)
        console.log(response.data)
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("userId",response.data.user._id)
         console.log(localStorage.getItem("userId"))
        resetForm()
        navigate("/dashboard")
        return response.data.user
      
    }
    catch(err){
     console.log(err.response.data.error)
     return rejectWithValue(err.response.data.error)
    }
})

export const userRole = createAsyncThunk("users/userRole",async(_,{rejectWithValue})=>{
    try{
        const token = localStorage.getItem("token")
        const response = await axios.get("/api/userDetails",{
            headers:{Authorization:token}
        })
        console.log(response.data)
        return response.data
    } 
    catch(err){
      console.log(err)
      return rejectWithValue(err.response.data.error)
    }
})

export const profileUpdate = createAsyncThunk("users/profileUpdate",async(formData,{rejectWithValue})=>{
    try{
        const response = await axios.put("/api/userDetailsPost",formData,{headers:{
            Authorization:localStorage.getItem("token"),
            "Content-Type":"multipart/form-data"
        }})
        console.log(response.data)
        return response.data
    }
    catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.error)
    }
})





const usersSlice = createSlice({
    name:"users",
    initialState:{
        isloggedIn:false,
        user:[],
        serverErrors:null
    },
    reducers:{
      logout:(state,action)=>{
        state.isloggedIn=false
        state.user=null
      }
  
    },
    extraReducers:(builder)=>{
        builder.addCase(userRegister.fulfilled,(state,action)=>{
          return{...state,isloggedIn:true,user:action.payload}
        })
        builder.addCase(userRegister.rejected,(state,action)=>{
           return {...state,isloggedIn:false,user:null,serverErrors:action.payload}
        })
        builder.addCase(userLogin.fulfilled,(state,action)=>{
           return {...state,isloggedIn:true,user:action.payload} 
        })
        builder.addCase(userLogin.rejected,(state,action)=>{
            return {...state,isloggedIn:false,user:null,serverErrors:action.payload}
        })  
        builder.addCase(userRole.fulfilled,(state,action)=>{
            return {...state,isloggedIn:true,user:action.payload}
        })
        builder.addCase(userRole.rejected,(state,action)=>{
            return{...state,serverErrors:action.payload,user:null}
        })
        builder.addCase(profileUpdate.fulfilled,(state,action)=>{
            state.user = action.payload
            state.serverErrors = null
        })
        builder.addCase(profileUpdate.rejected,(state,action)=>{
            state.serverErrors = action.payload
            state.user = []
        })

    }

})

export const {logout} = usersSlice.actions
export default usersSlice.reducer