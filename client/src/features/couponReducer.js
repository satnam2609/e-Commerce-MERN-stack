import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCoupon: false,
};

const couponSlice = createSlice({
  name: "Coupon",
  initialState,
  reducers: {
    couponApplied: (state, action) => {
      state.isCoupon = action.payload;
    },
  },
});

export const { couponApplied } = couponSlice.actions;
export default couponSlice.reducer;
