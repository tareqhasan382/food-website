import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { cartKey } from "../constant/storageKey";
import type { IFood, ICartItem } from "../types/food";
import { getStoredJson, setStoredJson } from "../utils/local-storage";

interface CartState {
  items: ICartItem[];
}

const initialState: CartState = {
  items: getStoredJson<ICartItem[]>(cartKey, []),
};

const persist = (items: ICartItem[]): void => setStoredJson(cartKey, items);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<IFood>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
        toast.info(`${action.payload.name} quantity increased`);
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
        toast.success(`${action.payload.name} added to cart`);
      }
      persist(state.items);
    },
    removeOne(state, action: PayloadAction<IFood>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing && existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
        toast.error(`${action.payload.name} removed from cart`, {
          icon: false,
        });
      }
      persist(state.items);
    },
    removeFromCart(state, action: PayloadAction<IFood>) {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
      toast.error(`${action.payload.name} removed from cart`, {
        icon: false,
      });
      persist(state.items);
    },
    clearCart(state) {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, removeOne, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
