import { baseApi } from "./baseApi";
import type { IPayment } from "../../types/order";

export interface CreatePaymentIntentResult {
  payment: IPayment;
  clientSecret: string | null;
}

interface VerifyPaymentArgs {
  paymentId?: string;
  paymentIntentId?: string;
}

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data;
};

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPaymentIntent: build.mutation<CreatePaymentIntentResult, void>({
      query: () => ({
        url: "/api/v1/payments/create-payment-intent",
        method: "POST",
      }),
      invalidatesTags: ["payment"],
      transformResponse: (response: unknown): CreatePaymentIntentResult =>
        unwrapData<CreatePaymentIntentResult>(response),
    }),

    verifyPayment: build.mutation<IPayment, VerifyPaymentArgs>({
      query: (args) => ({
        url: "/api/v1/payments/verify",
        method: "POST",
        data: args,
      }),
      invalidatesTags: ["payment"],
      transformResponse: (response: unknown): IPayment =>
        unwrapData<IPayment>(response),
    }),

    getPaymentById: build.query<IPayment, string>({
      query: (id) => ({
        url: `/api/v1/payments/${id}`,
        method: "GET",
      }),
      providesTags: ["payment"],
      transformResponse: (response: unknown): IPayment =>
        unwrapData<IPayment>(response),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useVerifyPaymentMutation,
  useGetPaymentByIdQuery,
} = paymentApi;
