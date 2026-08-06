import { baseApi } from "./baseApi";
import type { IFood } from "../../types/food";

export interface IWishlistResponse {
  _id: string;
  userId: string;
  foods: IFood[];
  totalItems: number;
}

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data;
};

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query<IWishlistResponse, void>({
      query: () => ({
        url: "/api/v1/wishlist",
        method: "GET",
      }),
      providesTags: ["wishlist"],
      transformResponse: (response: unknown): IWishlistResponse =>
        unwrapData<IWishlistResponse>(response),
    }),

    addToWishlist: build.mutation<IWishlistResponse, string>({
      query: (foodId) => ({
        url: "/api/v1/wishlist/items",
        method: "POST",
        data: { foodId },
      }),
      invalidatesTags: ["wishlist"],
      transformResponse: (response: unknown): IWishlistResponse =>
        unwrapData<IWishlistResponse>(response),
    }),

    removeFromWishlist: build.mutation<IWishlistResponse, string>({
      query: (foodId) => ({
        url: `/api/v1/wishlist/items/${foodId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["wishlist"],
      transformResponse: (response: unknown): IWishlistResponse =>
        unwrapData<IWishlistResponse>(response),
    }),

    moveWishlistToCart: build.mutation<IWishlistResponse, string>({
      query: (foodId) => ({
        url: `/api/v1/wishlist/items/${foodId}/move-to-cart`,
        method: "POST",
      }),
      invalidatesTags: ["wishlist", "cart"],
      transformResponse: (response: unknown): IWishlistResponse =>
        unwrapData<IWishlistResponse>(response),
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useMoveWishlistToCartMutation,
} = wishlistApi;
