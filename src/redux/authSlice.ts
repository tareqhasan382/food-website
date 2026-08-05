import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../types/auth";
import {
  getFromLocalStorage,
  removeUserInfo,
  setToLocalStorage,
} from "../utils/local-storage";
import { authKey } from "../constant/storageKey";
import { tokenToUser } from "../utils/session";

interface AuthState {
  user: IUser | null;
  token: string | null;
}

const token = getFromLocalStorage(authKey);

const initialState: AuthState = {
  user: tokenToUser(token),
  token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      setToLocalStorage(authKey, action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      removeUserInfo(authKey);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
