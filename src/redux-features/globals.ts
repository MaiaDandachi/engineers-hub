/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: {},
};

const globalsSlice = createSlice({
  name: 'globals',
  initialState,
  reducers: {},
});

export default globalsSlice.reducer;
