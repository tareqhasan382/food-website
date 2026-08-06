import { baseApi } from "./baseApi";
import type { IMeta } from "../../types/common";
import type {
  ICreateReviewArgs,
  IDeleteReviewArgs,
  IGetFoodReviewsResult,
  IReview,
  IReviewMeta,
  IReviewSummary,
  IReviewWithFood,
  IUpdateReviewArgs,
} from "../../types/review";

interface GetFoodReviewsArgs {
  foodId: string;
  page?: number;
  limit?: number;
}

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data;
};

const reviewInvalidates = (
  _result: unknown,
  _error: unknown,
  args: { foodId: string }
) => [
  "review" as const,
  "food" as const,
  { type: "food" as const, id: args.foodId },
];

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFoodReviews: build.query<IGetFoodReviewsResult, GetFoodReviewsArgs>({
      query: ({ foodId, page, limit }) => ({
        url: `/api/v1/foods/${foodId}/reviews`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["review"],
      transformResponse: (response: unknown): IGetFoodReviewsResult => {
        const env = response as {
          data?: {
            summary?: IReviewSummary;
            reviews?: IReview[];
          };
          meta?: IMeta;
        };
        return {
          summary: env.data?.summary ?? { averageRating: 0, ratingCount: 0 },
          reviews: env.data?.reviews ?? [],
          meta: (env.meta as IReviewMeta) ?? {
            page: 1,
            limit: 5,
            total: 0,
            totalPages: 0,
          },
        };
      },
    }),

    getMyReviews: build.query<IReviewWithFood[], { limit?: number }>({
      query: (args) => ({
        url: "/api/v1/reviews/mine",
        method: "GET",
        params: args,
      }),
      providesTags: ["review"],
      transformResponse: (response: unknown): IReviewWithFood[] => {
        const env = response as { data?: IReviewWithFood[] };
        return env.data ?? [];
      },
    }),

    createReview: build.mutation<IReview, ICreateReviewArgs>({
      query: (args) => ({
        url: "/api/v1/reviews",
        method: "POST",
        data: args,
      }),
      invalidatesTags: reviewInvalidates,
      transformResponse: (response: unknown): IReview =>
        unwrapData<IReview>(response),
    }),

    updateReview: build.mutation<IReview, IUpdateReviewArgs>({
      query: ({ reviewId, rating, comment }) => ({
        url: `/api/v1/reviews/${reviewId}`,
        method: "PATCH",
        data: { rating, comment },
      }),
      invalidatesTags: reviewInvalidates,
      transformResponse: (response: unknown): IReview =>
        unwrapData<IReview>(response),
    }),

    deleteReview: build.mutation<void, IDeleteReviewArgs>({
      query: ({ reviewId }) => ({
        url: `/api/v1/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: reviewInvalidates,
    }),
  }),
});

export const {
  useGetFoodReviewsQuery,
  useGetMyReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
