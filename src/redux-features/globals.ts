/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const initialState: { socket: DefaultEventsMap } = {
  socket: {},
};

const globalsSlice = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    deleteSocket: (state) => {
      state.socket = {};
    },
  },
});

export const { setSocket, deleteSocket } = globalsSlice.actions;

export default globalsSlice.reducer;
