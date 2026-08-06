import { baseApi } from "./baseApi";
import type {
  BestSellingFood,
  DashboardOverview,
  OrdersPoint,
  RevenuePoint,
  UsersPoint,
} from "../../types/admin";

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data;
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardOverview: build.query<DashboardOverview, void>({
      query: () => ({
        url: "/api/v1/admin/dashboard/overview",
        method: "GET",
      }),
      providesTags: ["dashboard"],
      transformResponse: (response: unknown): DashboardOverview =>
        unwrapData<DashboardOverview>(response),
    }),

    getRevenueChart: build.query<RevenuePoint[], number>({
      query: (days) => ({
        url: "/api/v1/admin/dashboard/charts/revenue",
        method: "GET",
        params: { days },
      }),
      providesTags: ["dashboard"],
      transformResponse: (response: unknown): RevenuePoint[] =>
        unwrapData<RevenuePoint[]>(response) ?? [],
    }),

    getOrdersChart: build.query<OrdersPoint[], number>({
      query: (days) => ({
        url: "/api/v1/admin/dashboard/charts/orders",
        method: "GET",
        params: { days },
      }),
      providesTags: ["dashboard"],
      transformResponse: (response: unknown): OrdersPoint[] =>
        unwrapData<OrdersPoint[]>(response) ?? [],
    }),

    getUsersChart: build.query<UsersPoint[], number>({
      query: (days) => ({
        url: "/api/v1/admin/dashboard/charts/users",
        method: "GET",
        params: { days },
      }),
      providesTags: ["dashboard"],
      transformResponse: (response: unknown): UsersPoint[] =>
        unwrapData<UsersPoint[]>(response) ?? [],
    }),

    getBestSellingFoods: build.query<BestSellingFood[], number>({
      query: (limit) => ({
        url: "/api/v1/admin/dashboard/best-selling-foods",
        method: "GET",
        params: { limit },
      }),
      providesTags: ["dashboard"],
      transformResponse: (response: unknown): BestSellingFood[] =>
        unwrapData<BestSellingFood[]>(response) ?? [],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetRevenueChartQuery,
  useGetOrdersChartQuery,
  useGetUsersChartQuery,
  useGetBestSellingFoodsQuery,
} = adminApi;
