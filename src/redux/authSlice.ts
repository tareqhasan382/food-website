import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../types/auth";
import {
  getFromLocalStorage,
  getStoredJson,
  removeUserInfo,
  setToLocalStorage,
  setStoredJson,
} from "../utils/local-storage";
import { authKey, userKey } from "../constant/storageKey";

interface AuthState {
  user: IUser | null;
  token: string | null;
}

const token = getFromLocalStorage(authKey);

const initialState: AuthState = {
  user: getStoredJson<IUser | null>(userKey, null),
  token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: IUser; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      setToLocalStorage(authKey, action.payload.token);
      setStoredJson(userKey, action.payload.user);
    },
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      setStoredJson(userKey, action.payload);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      removeUserInfo(authKey);
      removeUserInfo(userKey);
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
