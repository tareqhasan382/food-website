import { getBaseUrl } from "../helpers/config/envConfig";
import { instance } from "../helpers/axios/axiosInstance";
import type {
  IAuthResult,
  IChangePasswordPayload,
  ILoginPayload,
  IRegisterPayload,
  IUser,
} from "../types/auth";
import { removeUserInfo, setToLocalStorage } from "../utils/local-storage";
import { authKey, userKey } from "../constant/storageKey";

const AUTH_URL = `${getBaseUrl()}/api/v1/auth`;

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const unwrap = async <T>(
  promise: Promise<{ data: ApiEnvelope<T> }>
): Promise<T> => {
  const response = await promise;
  return response.data.data;
};

export const login = async (payload: ILoginPayload): Promise<IAuthResult> => {
  const data = await unwrap<{ accessToken: string }>(
    instance.post(`${AUTH_URL}/login`, payload)
  );

  const token = data.accessToken;
  if (!token) {
    throw new Error("Login succeeded but no access token was returned.");
  }

  setToLocalStorage(authKey, token);

  const user = await unwrap<IUser>(instance.get(`${AUTH_URL}/me`));

  return { user, token };
};

export const register = async (payload: IRegisterPayload): Promise<IUser> =>
  unwrap<IUser>(instance.post(`${AUTH_URL}/register`, payload));

export const verifyEmail = async (token: string): Promise<IUser> =>
  unwrap<IUser>(instance.get(`${AUTH_URL}/verify-email`, { params: { token } }));

export const forgotPassword = async (email: string): Promise<void> => {
  await unwrap<null>(instance.post(`${AUTH_URL}/forgot-password`, { email }));
};

export const resetPassword = async (
  token: string,
  password: string
): Promise<void> => {
  await unwrap<null>(
    instance.post(`${AUTH_URL}/reset-password`, { password }, { params: { token } })
  );
};

export const changePassword = async (
  payload: IChangePasswordPayload
): Promise<void> => {
  await unwrap<null>(instance.post(`${AUTH_URL}/change-password`, payload));
};

export const logout = async (): Promise<void> => {
  try {
    await instance.post(`${AUTH_URL}/logout`);
  } finally {
    removeUserInfo(authKey);
    removeUserInfo(userKey);
  }
};
