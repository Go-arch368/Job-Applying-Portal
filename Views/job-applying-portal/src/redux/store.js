import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice"
import recruiterReducer from "./slices/recruiterSlice"
import adminVerifyReducer from "./slices/adminVerifySlice"
import jobpostingReducer from './slices/jobpostingSlice'
import questionReducer from "./slices/questionSlice"
import jobapplyReducer from "./slices/jobapplySlice"
import jobFairReducer from "./slices/jobFairSlice"
import profileReducer from "./slices/profileSlice"
import resetPasswordReducer from "./slices/resetPasswordSlice"
import supportReducer from "./slices/supportSlice";
const store = configureStore({
    reducer:{
       users:usersReducer,
       recruiter:recruiterReducer,
       adminVerify:adminVerifyReducer,
       jobposting:jobpostingReducer,
       questions:questionReducer,
       jobapplying:jobapplyReducer, 
       jobFair:jobFairReducer,
       profile:profileReducer,
       resetPassword:resetPasswordReducer,
       support:supportReducer
    }
})

export default store