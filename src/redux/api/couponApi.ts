import { baseApi } from "./baseApi";
import type {
  AdminCoupon,
  AdminCouponPayload,
  AdminCouponsResult,
} from "../../types/admin";

const EMPTY_META = { page: 1, limit: 10, total: 0, totalPages: 0 };

interface GetAdminCouponsArgs {
  searchTerm?: string;
  type?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data;
};

export const couponAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminCoupons: build.query<AdminCouponsResult, GetAdminCouponsArgs>({
      query: (args) => ({
        url: "/api/v1/admin/coupons",
        method: "GET",
        params: args,
      }),
      providesTags: ["coupon"],
      transformResponse: (response: unknown): AdminCouponsResult => {
        const env = response as {
          data?: AdminCoupon[];
          meta?: { page: number; limit: number; total: number; totalPages: number };
        };
        return {
          coupons: env.data ?? [],
          meta: env.meta ?? EMPTY_META,
        };
      },
    }),

    createCoupon: build.mutation<AdminCoupon, AdminCouponPayload>({
      query: (data) => ({
        url: "/api/v1/admin/coupons",
        method: "POST",
        data,
      }),
      invalidatesTags: ["coupon"],
      transformResponse: (response: unknown): AdminCoupon =>
        unwrapData<AdminCoupon>(response),
    }),

    updateCoupon: build.mutation<
      AdminCoupon,
      { id: string; data: Partial<AdminCouponPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/admin/coupons/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["coupon"],
      transformResponse: (response: unknown): AdminCoupon =>
        unwrapData<AdminCoupon>(response),
    }),

    deleteCoupon: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/admin/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),
  }),
});

export const {
  useGetAdminCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponAdminApi;
