import authReducer from "./authSlice";
import cardReducer from "./cardSlice";
import wishlistReducer from "./wishlistSlice";
import { baseApi } from "./api/baseApi";

export const reducer = {
  auth: authReducer,
  cart: cardReducer,
  wishlist: wishlistReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};
