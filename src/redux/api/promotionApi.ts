import { baseApi } from "./baseApi";
import type {
  IPromotion,
  ICreatePromotionPayload,
} from "../../types/promotion";

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data as T;
};

export const promotionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActivePromotions: build.query<IPromotion[], void>({
      query: () => ({
        url: "/api/v1/promotions",
        method: "GET",
      }),
      providesTags: ["promotion"],
      transformResponse: (response: unknown): IPromotion[] =>
        unwrapData<IPromotion[]>(response) ?? [],
    }),

    getAllPromotions: build.query<IPromotion[], void>({
      query: () => ({
        url: "/api/v1/admin/promotions",
        method: "GET",
      }),
      providesTags: ["promotion"],
      transformResponse: (response: unknown): IPromotion[] =>
        unwrapData<IPromotion[]>(response) ?? [],
    }),

    createPromotion: build.mutation<IPromotion, ICreatePromotionPayload>({
      query: (data) => ({
        url: "/api/v1/admin/promotions",
        method: "POST",
        data,
      }),
      invalidatesTags: ["promotion"],
      transformResponse: (response: unknown): IPromotion =>
        unwrapData<IPromotion>(response),
    }),

    updatePromotion: build.mutation<
      IPromotion,
      { id: string; data: Partial<ICreatePromotionPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/admin/promotions/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["promotion"],
      transformResponse: (response: unknown): IPromotion =>
        unwrapData<IPromotion>(response),
    }),

    deletePromotion: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/admin/promotions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["promotion"],
    }),
  }),
});

export const {
  useGetActivePromotionsQuery,
  useGetAllPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionApi;
