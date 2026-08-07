import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { wishlistKey } from "../constant/storageKey";
import type { IFood } from "../types/food";
import { getStoredJson, setStoredJson } from "../utils/local-storage";

interface WishlistState {
  items: IFood[];
}

const isWishlistItem = (raw: unknown): raw is IFood => {
  if (!raw || typeof raw !== "object") return false;
  const r = raw as Record<string, unknown>;
  return typeof r._id === "string" && r._id.length > 0;
};

const normalize = (raw: unknown): IFood[] => {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isWishlistItem);
};

const initialState: WishlistState = {
  items: normalize(getStoredJson<IFood[]>(wishlistKey, [])),
};

const persist = (items: IFood[]): void => setStoredJson(wishlistKey, items);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<IFood>) {
      const exists = state.items.some((i) => i._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
        toast.success(`${action.payload.name} added to wishlist`, {
          id: `wishlist-add-${action.payload._id}`,
        });
        persist(state.items);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      const found = state.items.find((i) => i._id === action.payload);
      state.items = state.items.filter((i) => i._id !== action.payload);
      if (found) {
        toast(`${found.name} removed from wishlist`, {
          id: `wishlist-remove-${action.payload}`,
        });
      }
      persist(state.items);
    },
    toggleWishlist(state, action: PayloadAction<IFood>) {
      const exists = state.items.some((i) => i._id === action.payload._id);
      if (exists) {
        state.items = state.items.filter((i) => i._id !== action.payload._id);
        toast(`${action.payload.name} removed from wishlist`, {
          id: `wishlist-toggle-${action.payload._id}`,
        });
      } else {
        state.items.push(action.payload);
        toast.success(`${action.payload.name} added to wishlist`, {
          id: `wishlist-toggle-${action.payload._id}`,
        });
      }
      persist(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      persist(state.items);
    },
    hydrateWishlistFromServer(
      state,
      action: PayloadAction<{ foods: IFood[] }>
    ) {
      state.items = action.payload.foods;
      persist(state.items);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  hydrateWishlistFromServer,
} = wishlistSlice.actions;

export const selectIsInWishlist = (
  state: { wishlist: WishlistState },
  foodId: string
): boolean => state.wishlist.items.some((i) => i._id === foodId);

export const selectWishlistCount = (
  state: { wishlist: WishlistState }
): number => state.wishlist.items.length;

export default wishlistSlice.reducer;
