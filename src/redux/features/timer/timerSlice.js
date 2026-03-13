import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getBaseUrl } from '../../../utils/getBaseUrl';

// ১. এপিআই থেকে ডেটা আনার জন্য Async Thunk
export const fetchTimerData = createAsyncThunk(
  'timer/fetchTimerData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/bestdeals/timer`);
      
      /** * সংশোধন: আপনার API রেসপন্স সরাসরি অবজেক্ট দিচ্ছে। 
       * তাই response.data.data এর বদলে শুধু response.data রিটার্ন করতে হবে।
       */
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch timer");
    }
  }
);

const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    data: null,
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    clearTimerState: (state) => {
      state.data = null;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimerData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchTimerData.fulfilled, (state, action) => {
        state.isLoading = false;
        // এখন action.payload-এ আপনার পুরো অবজেক্টটি থাকবে
        state.data = action.payload; 
      })
      .addCase(fetchTimerData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Something went wrong";
      });
  }
});

export const { clearTimerState } = timerSlice.actions;
export default timerSlice.reducer;