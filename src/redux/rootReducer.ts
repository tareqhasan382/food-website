import cardReducer from "./cardSlice";
import authReducer from "./authSlice";
import foodReducer from "./foodSlice";

export const reducer = {
  cart: cardReducer,
  auth: authReducer,
  food: foodReducer,
};
