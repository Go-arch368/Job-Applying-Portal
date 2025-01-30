import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../Config/axios";

export const addQtn = createAsyncThunk(
    "questions/addQtn",
    async ({ newQuestion, jobId }, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/question", {
                jobId,
                questions: [{questionText:newQuestion}],
            },{headers:{Authorization:localStorage.getItem("token")}});
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error);
        }
    }
);

// export const getQtn = createAsyncThunk("questions/getQtn",async({jobId},{rejectWithValue})=>{
//     try{
//         const response = await axios.get(`/api/questions/${jobId}`,{headers:{Authorization:localStorage.getItem("token")}})
//         console.log(response.data.questions)
//         return response.data.questions
//     }
//     catch(err){
//         console.log(err)
//         return rejectWithValue(err)
//     }
// })


const questionReducer = createSlice({
    name:"questions",
    initialState:{
        data:[],
        serverErrors:null
    },
    reducers:{

    },
    extraReducers:(builder)=>{
        // builder.addCase(getQtn.fulfilled,(state,action)=>{
        //    return {...state,data:action.payload}
        // })
        // builder.addCase(getQtn.rejected,(state,action)=>{
        //     return {...state,serverErrors:action.payload,data:null}
        // })

        // builder.addCase(addQtn.fulfilled, (state, action) => {
        //     return { ...state, data: [...state.data, ...action.payload] }; 
        // });
        // builder.addCase(addQtn.rejected, (state, action) => {
        //     return { ...state, serverErrors: action.payload }; 
        // });
    }
})

export default questionReducer.reducer