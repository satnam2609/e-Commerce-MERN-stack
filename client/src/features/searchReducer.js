import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  // isLoading: false,
  // isSuccess: false,
  // isError: false,
};

const saerchSlice = createSlice({
  name: "Search",
  initialState,
  reducers: {
    searchReducer: (state, action) => {
      state.text = action.payload;
    },
  },
});

export const { searchReducer } = saerchSlice.actions;
export default saerchSlice.reducer;
