/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
export const foodApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addFood: build.mutation({
      query: (data) => ({
        url: "/api/v1/create-food",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["food"],
    }),
    getFoods: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/api/v1/foods",
        method: "GET",
        params: arg,
      }),
      providesTags: ["food"],
    }),
    getFood: build.query({
      query: (id) => ({
        url: `/api/v1/food/${id}`,
        method: "GET",
      }),
    }),
    deleteFood: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/food/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["food"],
      // transformResponse: (response: ITrips) => {
      //   return {
      //     package: response, delete
      //   };
      // },
    }),
  }),
});

export const {
  useAddFoodMutation,
  useGetFoodsQuery,
  useGetFoodQuery,
  useDeleteFoodMutation,
} = foodApi;
