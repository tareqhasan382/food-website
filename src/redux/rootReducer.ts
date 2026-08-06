import authReducer from "./authSlice";
import cardReducer from "./cardSlice";
import wishlistReducer from "./wishlistSlice";
import { baseApi } from "./api/baseApi";
import foodReducer from "./foodSlice";

export const reducer = {
  auth: authReducer,
  cart: cardReducer,
  wishlist: wishlistReducer,
  food: foodReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};
