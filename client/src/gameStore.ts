import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    game: {}
  },
  reducers: {
    createRoom: () => { },
    joinRoom: () => { },
    setState: (state, action) => {
      return { ...state, game: action.payload };
    },
  }
});

export const { setState } = gameSlice.actions;

export default gameSlice.reducer;