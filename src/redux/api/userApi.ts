import { baseApi } from "./baseApi";
import type { Role } from "../../types/auth";
import type { AdminUser, AdminUsersResult } from "../../types/admin";

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data;
};

const EMPTY_META = { page: 1, limit: 10, total: 0, totalPages: 0 };

interface GetAdminUsersArgs {
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminUsers: build.query<AdminUsersResult, GetAdminUsersArgs>({
      query: (args) => ({
        url: "/api/v1/admin/users",
        method: "GET",
        params: args,
      }),
      providesTags: ["user"],
      transformResponse: (response: unknown): AdminUsersResult => {
        const env = response as {
          data?: {
            meta?: {
              page: number;
              limit: number;
              total: number;
              totalPages: number;
            };
            data?: AdminUser[];
          };
        };
        return {
          users: env.data?.data ?? [],
          meta: env.data?.meta ?? EMPTY_META,
        };
      },
    }),

    updateUserRole: build.mutation<
      AdminUser,
      { id: string; role: Role }
    >({
      query: ({ id, role }) => ({
        url: `/api/v1/admin/users/${id}/role`,
        method: "PATCH",
        data: { role },
      }),
      invalidatesTags: ["user"],
      transformResponse: (response: unknown): AdminUser =>
        unwrapData<AdminUser>(response),
    }),

    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userApi;
