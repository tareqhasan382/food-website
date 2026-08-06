import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { foods as seedFoods } from "../data/data";
import { foodKey } from "../constant/storageKey";
import type { ILocalFood } from "../types/food";
import { getStoredJson, setStoredJson } from "../utils/local-storage";

const loadFoods = (): ILocalFood[] => {
  const stored = getStoredJson<ILocalFood[]>(foodKey, []);
  if (stored.length > 0) return stored;
  setStoredJson(foodKey, seedFoods);
  return seedFoods;
};

const initialState: ILocalFood[] = loadFoods();

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    addFood(state, action: PayloadAction<ILocalFood>) {
      const next = [action.payload, ...state];
      setStoredJson(foodKey, next);
      return next;
    },
    updateFood(state, action: PayloadAction<ILocalFood>) {
      const next = state.map((f) =>
        f.id === action.payload.id ? action.payload : f
      );
      setStoredJson(foodKey, next);
      return next;
    },
    deleteFood(state, action: PayloadAction<string>) {
      const next = state.filter((f) => f.id !== action.payload);
      setStoredJson(foodKey, next);
      return next;
    },
    resetFoods() {
      setStoredJson(foodKey, seedFoods);
      return seedFoods;
    },
  },
});

export const { addFood, updateFood, deleteFood, resetFoods } = foodSlice.actions;
export default foodSlice.reducer;
