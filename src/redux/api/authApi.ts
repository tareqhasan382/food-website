import { baseApi } from "./baseApi";
const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation({
      query: (loginData) => ({
        url: `/${AUTH_URL}/login`,
        method: "POST",
        data: loginData,
      }),
      invalidatesTags: ["auth"],
    }),
    login: build.mutation({
      query: (loginData) => ({
        url: `/${AUTH_URL}/login`,
        method: "POST",
        data: loginData,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;
