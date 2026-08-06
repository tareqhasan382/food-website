import { baseApi } from "./baseApi";
import type { IFood } from "../../types/food";

export interface ICartItemResponse {
  foodId: IFood;
  quantity: number;
  lineTotal: number;
  itemDiscount: number;
}

export interface ICartResponse {
  _id: string;
  userId: string;
  items: ICartItemResponse[];
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  couponCode?: string;
  couponDiscount: number;
  total: number;
}

interface AddItemArgs {
  foodId: string;
  quantity: number;
}

interface UpdateQtyArgs {
  foodId: string;
  quantity: number;
}

interface ValidateCouponArgs {
  code: string;
  subtotal?: number;
}

interface ApplyCouponArgs {
  code: string;
}

interface ValidateCouponResult {
  coupon: {
    _id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    expiryDate: string;
    minimumOrder: number;
  };
  discount: number;
}

const unwrapData = <T>(response: unknown): T => {
  const env = response as { data: T };
  return env.data;
};

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<ICartResponse, void>({
      query: () => ({
        url: "/api/v1/cart",
        method: "GET",
      }),
      providesTags: ["cart"],
      transformResponse: (response: unknown): ICartResponse =>
        unwrapData<ICartResponse>(response),
    }),

    addItemToCart: build.mutation<ICartResponse, AddItemArgs>({
      query: (args) => ({
        url: "/api/v1/cart/items",
        method: "POST",
        data: args,
      }),
      invalidatesTags: ["cart"],
      transformResponse: (response: unknown): ICartResponse =>
        unwrapData<ICartResponse>(response),
    }),

    updateCartQuantity: build.mutation<ICartResponse, UpdateQtyArgs>({
      query: ({ foodId, quantity }) => ({
        url: `/api/v1/cart/items/${foodId}`,
        method: "PATCH",
        data: { quantity },
      }),
      invalidatesTags: ["cart"],
      transformResponse: (response: unknown): ICartResponse =>
        unwrapData<ICartResponse>(response),
    }),

    removeItemFromCart: build.mutation<ICartResponse, string>({
      query: (foodId) => ({
        url: `/api/v1/cart/items/${foodId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
      transformResponse: (response: unknown): ICartResponse =>
        unwrapData<ICartResponse>(response),
    }),

    clearServerCart: build.mutation<ICartResponse, void>({
      query: () => ({
        url: "/api/v1/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
      transformResponse: (response: unknown): ICartResponse =>
        unwrapData<ICartResponse>(response),
    }),

    validateCoupon: build.mutation<ValidateCouponResult, ValidateCouponArgs>({
      query: (args) => ({
        url: "/api/v1/coupons/validate",
        method: "POST",
        data: args,
      }),
      transformResponse: (response: unknown): ValidateCouponResult =>
        unwrapData<ValidateCouponResult>(response),
    }),

    applyCoupon: build.mutation<ICartResponse, ApplyCouponArgs>({
      query: (args) => ({
        url: "/api/v1/coupons/apply",
        method: "POST",
        data: args,
      }),
      invalidatesTags: ["cart", "coupon"],
      transformResponse: (response: unknown): ICartResponse =>
        unwrapData<ICartResponse>(response),
    }),

    removeCoupon: build.mutation<ICartResponse, void>({
      query: () => ({
        url: "/api/v1/coupons/applied",
        method: "DELETE",
      }),
      invalidatesTags: ["cart", "coupon"],
      transformResponse: (response: unknown): ICartResponse =>
        unwrapData<ICartResponse>(response),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddItemToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveItemFromCartMutation,
  useClearServerCartMutation,
  useValidateCouponMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = cartApi;
