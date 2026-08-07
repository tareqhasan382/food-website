import { baseApi } from "./baseApi";
import type {
  IFood,
  IFoodsMeta,
  IGetFoodsArgs,
  IGetFoodsResult,
} from "../../types/food";

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data as T;
};

export const foodApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createFood: build.mutation<IFood, FormData | Record<string, unknown>>({
      query: (data) => ({
        url: "/api/v1/foods",
        method: "POST",
        data,
        formData: data instanceof FormData,
      }),
      invalidatesTags: ["food"],
      transformResponse: (response: unknown): IFood => unwrapData<IFood>(response),
    }),

    updateFood: build.mutation<
      IFood,
      { id: string; data: FormData | Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/foods/${id}`,
        method: "PATCH",
        data,
        formData: data instanceof FormData,
      }),
      invalidatesTags: ["food"],
      transformResponse: (response: unknown): IFood => unwrapData<IFood>(response),
    }),

    getFoods: build.query<IGetFoodsResult, IGetFoodsArgs>({
      query: (arg) => ({
        url: "/api/v1/foods",
        method: "GET",
        params: arg,
      }),
      providesTags: ["food"],
      transformResponse: (response: unknown): IGetFoodsResult => {
        const env = response as { data?: IFood[]; meta?: IFoodsMeta };
        return {
          foods: env.data ?? [],
          meta: env.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      },
    }),

    getFood: build.query<IFood, string>({
      query: (id) => ({
        url: `/api/v1/foods/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: "food", id }],
      transformResponse: (response: unknown): IFood => unwrapData<IFood>(response),
    }),

    deleteFood: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/foods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["food"],
    }),
  }),
});

export const {
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useGetFoodsQuery,
  useGetFoodQuery,
  useDeleteFoodMutation,
} = foodApi;
