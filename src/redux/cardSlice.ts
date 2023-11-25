/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export const setToLocalStorage = (key: string, token: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.setItem(key, token);
};
interface IFood {
  _id: string;
  name: string;
  category: string;
  Image: string;
  price: number;
  quantity?: number;
}
interface ICart {
  foods: IFood[];
}

const initialState: ICart = {
  foods: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IFood>) => {
      const existing = state.foods.find(
        (item: IFood) => item._id === action.payload._id
      );

      if (existing) {
        // Item already exists in the cart, increase quantity
        existing.quantity = existing.quantity! + 1;
        // existing.total += action.payload.price;
      } else {
        // Item is not in the cart, add it

        state.foods.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },
    //Remove One Cart
    removeOne: (state, action: PayloadAction<IFood>) => {
      const existing = state.foods.find(
        (item: IFood) => item._id === action.payload._id
      );
      if (existing && existing.quantity! > 1) {
        existing.quantity = existing.quantity! - 1;
      } else {
        state.foods = state.foods.filter(
          (item: IFood) => item._id !== action.payload._id
        );
      }
    },

    //==========
    removeFromCart: (state, action: PayloadAction<IFood>) => {
      state.foods = state.foods.filter(
        (item: IFood) => item._id !== action.payload._id
      );
    },
  },
});
export const { addToCart, removeOne, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
