import { baseApi } from "./baseApi";
// /auth/login
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation({
      query: (loginData) => ({
        url: "/api/v1/auth/signup",
        method: "POST",
        data: loginData,
      }),
      invalidatesTags: ["auth"],
    }),
    login: build.mutation({
      query: (loginData) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        data: loginData,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;
