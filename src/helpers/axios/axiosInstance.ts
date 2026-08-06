/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";
import { getFromLocalStorage } from "../../utils/local-storage";
import { authKey } from "../../constant/storageKey";
import {
  IGenericErrorMessage,
  IGenericErrorResponse,
  ResponseSuccessType,
} from "../../types/common";
//======================

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

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
