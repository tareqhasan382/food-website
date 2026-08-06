import { baseApi } from "./baseApi";
import type { IDeliveryAddress, IOrder } from "../../types/order";
import type { OrderStatus } from "../../types/order";
import type { AdminOrder, AdminOrderStats } from "../../types/admin";
import type { IMeta } from "../../types/common";

interface CreateOrderArgs {
  paymentId?: string;
  deliveryAddress?: IDeliveryAddress;
}

export interface IOrderHistoryMeta extends IMeta {
  totalPages: number;
}

export interface IOrderHistoryResult {
  orders: IOrder[];
  meta: IOrderHistoryMeta;
}

export interface IAdminOrdersResult {
  orders: AdminOrder[];
  meta: IOrderHistoryMeta;
}

interface GetAdminOrdersArgs {
  status?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

interface GetOrderHistoryArgs {
  status?: string;
  page?: number;
  limit?: number;
}

interface CancelOrderArgs {
  orderId: string;
  note?: string;
}

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data;
};

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<IOrder, CreateOrderArgs>({
      query: (args) => ({
        url: "/api/v1/orders",
        method: "POST",
        data: args,
      }),
      invalidatesTags: ["order", "cart"],
      transformResponse: (response: unknown): IOrder =>
        unwrapData<IOrder>(response),
    }),

    getOrderById: build.query<IOrder, string>({
      query: (id) => ({
        url: `/api/v1/orders/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "order", id }],
      transformResponse: (response: unknown): IOrder =>
        unwrapData<IOrder>(response),
    }),

    getOrderHistory: build.query<IOrderHistoryResult, GetOrderHistoryArgs>({
      query: (args) => ({
        url: "/api/v1/orders",
        method: "GET",
        params: args,
      }),
      providesTags: ["order"],
      transformResponse: (response: unknown): IOrderHistoryResult => {
        const env = response as {
          data?: IOrder[];
          meta?: IOrderHistoryMeta;
        };
        return {
          orders: env.data ?? [],
          meta: env.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      },
    }),

    cancelOrder: build.mutation<IOrder, CancelOrderArgs>({
      query: ({ orderId, note }) => ({
        url: `/api/v1/orders/${orderId}/cancel`,
        method: "POST",
        data: { note },
      }),
      invalidatesTags: ["order"],
      transformResponse: (response: unknown): IOrder =>
        unwrapData<IOrder>(response),
    }),

    getAdminOrders: build.query<IAdminOrdersResult, GetAdminOrdersArgs>({
      query: (args) => ({
        url: "/api/v1/admin/orders",
        method: "GET",
        params: args,
      }),
      providesTags: ["order"],
      transformResponse: (response: unknown): IAdminOrdersResult => {
        const env = response as {
          data?: AdminOrder[];
          meta?: IOrderHistoryMeta;
        };
        return {
          orders: env.data ?? [],
          meta: env.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      },
    }),

    getOrderStats: build.query<AdminOrderStats, void>({
      query: () => ({
        url: "/api/v1/admin/orders/stats",
        method: "GET",
      }),
      providesTags: ["order"],
      transformResponse: (response: unknown): AdminOrderStats =>
        unwrapData<AdminOrderStats>(response),
    }),

    updateOrderStatus: build.mutation<
      IOrder,
      { orderId: string; status: OrderStatus; note?: string }
    >({
      query: ({ orderId, status, note }) => ({
        url: `/api/v1/admin/orders/${orderId}/status`,
        method: "PATCH",
        data: { status, note },
      }),
      invalidatesTags: ["order", "dashboard"],
      transformResponse: (response: unknown): IOrder =>
        unwrapData<IOrder>(response),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetOrderHistoryQuery,
  useCancelOrderMutation,
  useGetAdminOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
