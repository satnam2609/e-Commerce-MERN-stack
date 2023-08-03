import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    UserReducerFunc: (state, action) => {
      if (state.user) {
        state.user = null;
      } else {
        state.user = action.payload;
      }
    },
  },
});

export const { UserReducerFunc } = userSlice.actions;
export default userSlice.reducer;
