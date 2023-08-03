import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawer: true,
};

const drawerReducer = createSlice({
  name: "Drawer",
  initialState,
  reducers: {
    stateChange: (state) => {
      state.drawer = state.drawer === false ? true : false;
    },
  },
});

export default drawerReducer.reducer;
export const { stateChange } = drawerReducer.actions;
