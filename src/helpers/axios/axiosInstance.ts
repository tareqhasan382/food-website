/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getBaseUrl } from "../config/envConfig";
import { authKey, userKey } from "../../constant/storageKey";
import {
  getFromLocalStorage,
  setToLocalStorage,
  removeUserInfo,
} from "../../utils/local-storage";
import { store } from "../../redux/store";
import { logout } from "../../redux/authSlice";
import {
  IGenericErrorMessage,
  IGenericErrorResponse,
  ResponseSuccessType,
} from "../../types/common";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;
instance.defaults.withCredentials = true;

const REFRESH_URL = "/api/v1/auth/refresh-token";

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = getFromLocalStorage(authKey);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

/**
 * Single-flight refresh: only one refresh request runs at a time and every
 * request that 401s while it is in flight retries once the new token arrives.
 */
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = instance
      .post(`${getBaseUrl()}${REFRESH_URL}`)
      .then((response) => {
        const envelope = response?.data as { data?: { accessToken?: string } };
        const accessToken = envelope?.data?.accessToken;
        if (!accessToken) {
          throw new Error("Could not refresh access token");
        }
        setToLocalStorage(authKey, accessToken);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const clearSession = (): void => {
  removeUserInfo(authKey);
  removeUserInfo(userKey);
  store.dispatch(logout());
};

// Add a response interceptor
instance.interceptors.response.use(
  //@ts-ignore
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response?.data,
      meta: response?.data,
    };
    return responseObject;
  },
  async function (error) {
    const statusCode =
      error?.response?.status ?? error?.response?.data?.statusCode ?? 500;
    const originalConfig = error?.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const isAuthEndpoint =
      originalConfig?.url?.includes("/auth/refresh-token") ||
      originalConfig?.url?.includes("/auth/login");

    // Expired access token -> refresh and retry the original request once.
    if (statusCode === 401 && originalConfig && !originalConfig._retry && !isAuthEndpoint) {
      try {
        await refreshAccessToken();
        originalConfig._retry = true;
        return await instance(originalConfig);
      } catch (refreshError) {
        clearSession();
        return Promise.reject(refreshError);
      }
    }

    const rawMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    const rawErrors: IGenericErrorMessage[] =
      error?.response?.data?.errorMessages ?? [];

    const message =
      rawMessage !== "Validation Error"
        ? rawMessage
        : rawErrors[0]?.message || rawMessage;

    const responseObject: IGenericErrorResponse & { statusCode: number } = {
      statusCode,
      message,
      errorMessages: rawErrors.length ? rawErrors : [{ path: "", message }],
    };

    const err = new Error(message) as Error & {
      statusCode: number;
      response: IGenericErrorResponse;
    };
    err.statusCode = statusCode;
    err.response = responseObject;
    return Promise.reject(err);
  }
);

export { instance };
