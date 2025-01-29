import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice"
import recruiterReducer from "./slices/recruiterSlice"
import adminVerifyReducer from "./slices/adminVerifySlice"
const store = configureStore({
    reducer:{
       users:usersReducer,
       recruiter:recruiterReducer,
       adminVerify:adminVerifyReducer
    }
})

export default store