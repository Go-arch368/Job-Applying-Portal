import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../Config/axios";

// Async action to post a job
export const postjob = createAsyncThunk(
    "jobposting/postjob",
    async ({ jobDetails, resetForm ,navigate }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "/api/jobposting",
                jobDetails,
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            resetForm()
            const jobId = response.data._id
            navigate(`/create-questions/${jobId}`)
            console.log(response.data)
            return response.data;
          
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Job posting reducer
const jobpostingReducer = createSlice({
    name: "jobposting",
    initialState: {
        data: [],
        serverErrors: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postjob.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.serverErrors=null
            })
            .addCase(postjob.rejected, (state, action) => {
                state.serverErrors = action.payload;
            });
    }
});

export default jobpostingReducer.reducer;
