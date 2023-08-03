import { createSlice } from "@reduxjs/toolkit";

let cart;
if (typeof window !== "undefined") {
  cart = JSON.parse(localStorage.getItem("cart"));
}
const initialState = {
  cart: cart ? cart : [],
};

const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.cart = action.payload;
    },
    removeItem: (state) => {
      state.cart = [];
    },
  },
});

export default cartSlice.reducer;
export const { addItem, removeItem } = cartSlice.actions;
