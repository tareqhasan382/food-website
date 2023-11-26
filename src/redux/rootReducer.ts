import { baseApi } from "./api/baseApi";
import cardReducer from "./cardSlice";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  cart: cardReducer,
};
