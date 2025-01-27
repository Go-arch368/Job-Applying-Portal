import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice"
import recruiterReducer from "./slices/recruiterSlice"
const store = configureStore({
    reducer:{
       users:usersReducer,
       recruiter:recruiterReducer
    }
})

export default store