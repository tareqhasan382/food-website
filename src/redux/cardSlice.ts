/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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

export const getFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return [];
  }
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
};
const initialState: ICart = {
  // foods: [],
  foods: getFromLocalStorage("cartItem"),
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
        toast.info(`${action.payload.category} Increase SuccessFully`);
        // existing.total += action.payload.price;
      } else {
        // Item is not in the cart, add it

        state.foods.push({
          ...action.payload,
          quantity: 1,
        });
        toast.success(`Add ${action.payload.category} to Cart SuccessFully`);
      }

      localStorage.setItem("cartItem", JSON.stringify(state.foods));
    },
    //Remove One Cart
    removeOne: (state, action: PayloadAction<IFood>) => {
      const existing = state.foods.find(
        (item: IFood) => item._id === action.payload._id
      );
      if (existing && existing.quantity! > 1) {
        existing.quantity = existing.quantity! - 1;
        toast.warning(
          ` ${action.payload.category} Decrease to Cart SuccessFully`
        );
      } else {
        state.foods = state.foods.filter(
          (item: IFood) => item._id !== action.payload._id
        );
        toast.error(
          ` ${action.payload.category} Deleted to Cart SuccessFully`,
          { icon: false }
        );
      }
      localStorage.setItem("cartItem", JSON.stringify(state.foods));
    },

    //==========
    removeFromCart: (state, action: PayloadAction<IFood>) => {
      state.foods = state.foods.filter(
        (item: IFood) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItem", JSON.stringify(state.foods));
      toast.error(` ${action.payload.category} Deleted to Cart SuccessFully`, {
        icon: false,
      });
    },
  },
});
export const { addToCart, removeOne, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
