import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../Config/axios";


export const addQtn = createAsyncThunk("questions/addQtn", async ({ newQuestion, jobId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/question",
        {
          jobId,
          questions: [{ questionText: newQuestion }],
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log("API Response:", response.data.questions);
      return response.data.questions;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getQtn = createAsyncThunk( "questions/getQtn", async ({ jobId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/questions/${jobId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log("Full API Response:", response.data);
      return response.data;
    } catch (err) {
      console.log(err.response.data);
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateQuestions = createAsyncThunk("questions/updateQuestions",async({editId,newQuestion},{rejectWithValue})=>{
    try{
         const response = await axios.put(`/api/questions/${editId}`,{"updatedQuestionText":newQuestion},{headers:{Authorization:localStorage.getItem("token")}})
         console.log(response.data)
         return response.data
    }
    catch(err){
        console.log(err)
        return rejectWithValue(err)
    }
})

export const deleteQuestions = createAsyncThunk( "questions/deleteQuestions", async ({ id }, { rejectWithValue }) => {
      try {
        const response = await axios.delete(`/api/questions/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        console.log(response.data);
        return id; // Return the deleted question ID to update state
      } catch (err) {
        console.log(err);
        return rejectWithValue(err.response?.data?.message || "Failed to delete question");
      }
    }
  );
  

// Reducer
const questionReducer = createSlice({
  name: "questions",
  initialState: {
    data: [],
    serverErrors: null,
    editId:null
  },
  reducers: {
    assignEditId:(state,action)=>{
       state.editId=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQtn.fulfilled, (state, action) => {
        return { ...state, data: Array.isArray(action.payload) ? action.payload : [], serverErrors:null };
      })
      .addCase(getQtn.rejected, (state, action) => {
        return { ...state, serverErrors: action.payload, data: [] };
      })
      .addCase(addQtn.fulfilled, (state, action) => {
        // return { ...state, data: [...state.data, ...action.payload] };
        state.data = action.payload
      })
      .addCase(addQtn.rejected, (state, action) => {
        return { ...state, serverErrors: action.payload };
      })
      .addCase(updateQuestions.fulfilled,(state,action)=>{
        const index = state.data.findIndex((ele)=>ele._id===action.payload._id)
        state.data[index]= action.payload
        state.editId=null
      })
      .addCase(updateQuestions.rejected,(state,action)=>{
        state.serverErrors=action.payload
        state.data= null
      })
     .addCase(deleteQuestions.fulfilled, (state, action) => {
  state.data = state.data.map(q => ({
    ...q,
    questions: q.questions.filter(ele => ele._id !== action.payload) // Correct filtering
  }));
  state.serverErrors = null;
})
.addCase(deleteQuestions.rejected, (state, action) => {
  state.serverErrors = action.payload;
});

  },
});

export const {assignEditId} = questionReducer.actions
export default questionReducer.reducer;
