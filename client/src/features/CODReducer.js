import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCOD: false,
};

const CODReducer = createSlice({
  name: "COD",
  initialState,
  reducers: {
    CODReducerFunc: (state, action) => {
      if (state.isCOD) {
        state.isCOD = false;
      } else {
        state.isCOD = true;
      }
    },
  },
});

export default CODReducer.reducer;
export const { CODReducerFunc } = CODReducer.actions;
