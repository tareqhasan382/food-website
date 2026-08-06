/* eslint-disable prefer-const */
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { instance as axiosInstance } from "./axiosInstance";
import { IMeta } from "../../types/common";

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      meta?: IMeta;
      contentType?: string;
      formData?: boolean;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, contentType, formData }) => {
    try {
      const isFormData = formData || data instanceof FormData;
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: isFormData
          ? undefined
          : {
              "Content-Type": contentType || "application/json",
            },
        withCredentials: true,
      });
      return result;
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
