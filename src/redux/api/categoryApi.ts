import { baseApi } from "./baseApi";

export interface ICategoryResponse {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: ICategoryResponse[];
}

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data as T;
};

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<ICategoryResponse[], void>({
      query: () => ({
        url: "/api/v1/categories",
        method: "GET",
      }),
      providesTags: ["category"],
      transformResponse: (response: unknown): ICategoryResponse[] =>
        unwrapData<ICategoryResponse[]>(response) ?? [],
    }),

    getCategory: build.query<ICategoryResponse, string>({
      query: (id) => ({
        url: `/api/v1/categories/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: "category", id }],
      transformResponse: (response: unknown): ICategoryResponse =>
        unwrapData<ICategoryResponse>(response),
    }),

    createCategory: build.mutation<
      ICategoryResponse,
      FormData | Record<string, unknown>
    >({
      query: (data) => ({
        url: "/api/v1/categories",
        method: "POST",
        data,
        formData: data instanceof FormData,
      }),
      invalidatesTags: ["category"],
      transformResponse: (response: unknown): ICategoryResponse =>
        unwrapData<ICategoryResponse>(response),
    }),

    updateCategory: build.mutation<
      ICategoryResponse,
      { id: string; data: FormData | Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/api/v1/categories/${id}`,
        method: "PATCH",
        data,
        formData: data instanceof FormData,
      }),
      invalidatesTags: ["category"],
      transformResponse: (response: unknown): ICategoryResponse =>
        unwrapData<ICategoryResponse>(response),
    }),

    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
