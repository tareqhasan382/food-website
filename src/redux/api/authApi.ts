import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation({
      query: (data) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        data,
      }),
      invalidatesTags: ["auth"],
    }),
    login: build.mutation({
      query: (data) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        data,
      }),
      invalidatesTags: ["auth"],
    }),
    forgotPassword: build.mutation({
      query: (data) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        data,
      }),
    }),
    resetPassword: build.mutation({
      query: (data) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        data: { password: data.password },
        params: { token: data.token },
      }),
    }),
    verifyEmail: build.mutation({
      query: (data) => ({
        url: "/api/v1/auth/verify-email",
        method: "GET",
        params: { token: data.token },
      }),
    }),
    changePassword: build.mutation({
      query: (data) => ({
        url: "/api/v1/auth/change-password",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useChangePasswordMutation,
} = authApi;
