import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { cartKey, cartCouponKey } from "../constant/storageKey";
import type { IFood, ICartItem, IAppliedCoupon } from "../types/food";
import { getStoredJson, setStoredJson } from "../utils/local-storage";

export const DELIVERY_FEE = 2.99;
export const FREE_DELIVERY_THRESHOLD = 25;

interface CartState {
  items: ICartItem[];
  coupon: IAppliedCoupon | null;
}

const isNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

const isValidCartItem = (raw: unknown): raw is ICartItem => {
  if (!raw || typeof raw !== "object") return false;
  const r = raw as Record<string, unknown>;
  return (
    typeof r._id === "string" &&
    r._id.length > 0 &&
    typeof r.name === "string" &&
    isNumber(r.price) &&
    isNumber(r.quantity)
  );
};

const normalizeItems = (raw: unknown): ICartItem[] => {
  if (!Array.isArray(raw)) return [];
  const cleaned: ICartItem[] = [];
  for (const entry of raw) {
    if (!isValidCartItem(entry)) continue;
    const qty = Math.max(1, Math.floor(entry.quantity));
    cleaned.push({
      ...(entry as ICartItem),
      quantity: qty,
      price: Number(entry.price),
      stock: isNumber((entry as ICartItem).stock)
        ? Math.max(0, (entry as ICartItem).stock)
        : 999,
      images: Array.isArray((entry as ICartItem).images)
        ? (entry as ICartItem).images
        : [],
      ingredients: Array.isArray((entry as ICartItem).ingredients)
        ? (entry as ICartItem).ingredients
        : [],
      availability:
        typeof (entry as ICartItem).availability === "boolean"
          ? (entry as ICartItem).availability
          : true,
    });
  }
  return cleaned;
};

const normalizeCoupon = (raw: unknown): IAppliedCoupon | null => {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.code !== "string" || !isNumber(r.discount)) return null;
  return {
    code: r.code,
    discount: Number(r.discount),
    type:
      r.type === "percentage" || r.type === "fixed"
        ? (r.type as "percentage" | "fixed")
        : undefined,
  };
};

const initialState: CartState = {
  items: normalizeItems(getStoredJson<ICartItem[]>(cartKey, [])),
  coupon: normalizeCoupon(
    getStoredJson<IAppliedCoupon | null>(cartCouponKey, null)
  ),
};

const persist = (items: ICartItem[]): void => setStoredJson(cartKey, items);
const persistCoupon = (coupon: IAppliedCoupon | null): void =>
  setStoredJson(cartCouponKey, coupon);

const effectivePriceOf = (f: IFood): number =>
  f.discountPrice !== undefined && f.discountPrice < f.price
    ? f.discountPrice
    : f.price;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<IFood>) {
      const existing = state.items.find((i) => i._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
        toast(`${action.payload.name} quantity increased`);
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
        toast.success(`${action.payload.name} added to cart`);
      }
      persist(state.items);
    },
    addQuantity(state, action: PayloadAction<{ food: IFood; quantity: number }>) {
      const { food, quantity } = action.payload;
      const existing = state.items.find((i) => i._id === food._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...food, quantity });
      }
      toast.success(
        `${quantity} × ${food.name} ${quantity > 1 ? "items" : "item"} added`
      );
      persist(state.items);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ foodId: string; quantity: number }>
    ) {
      const { foodId, quantity } = action.payload;
      const existing = state.items.find((i) => i._id === foodId);
      if (existing) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== foodId);
          toast.error(`${existing.name} removed from cart`);
        } else {
          existing.quantity = quantity;
        }
        persist(state.items);
      }
    },
    removeOne(state, action: PayloadAction<IFood>) {
      const existing = state.items.find((i) => i._id === action.payload._id);
      if (existing && existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i._id !== action.payload._id);
        toast.error(`${action.payload.name} removed from cart`);
      }
      persist(state.items);
    },
    removeFromCart(state, action: PayloadAction<IFood>) {
      const existing = state.items.find((i) => i._id === action.payload._id);
      state.items = state.items.filter((i) => i._id !== action.payload._id);
      if (existing) {
        toast.error(`${existing.name} removed from cart`);
      }
      persist(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      persist(state.items);
      persistCoupon(null);
    },
    applyLocalCoupon(state, action: PayloadAction<IAppliedCoupon>) {
      state.coupon = action.payload;
      persistCoupon(state.coupon);
      toast.success(`Coupon ${action.payload.code} applied`);
    },
    removeLocalCoupon(state) {
      if (state.coupon) {
        toast(`Coupon ${state.coupon.code} removed`);
      }
      state.coupon = null;
      persistCoupon(null);
    },
    hydrateCartFromServer(
      state,
      action: PayloadAction<{
        items: ICartItem[];
        couponCode?: string;
        couponDiscount?: number;
      }>
    ) {
      state.items = action.payload.items;
      if (action.payload.couponCode && action.payload.couponDiscount) {
        state.coupon = {
          code: action.payload.couponCode,
          discount: action.payload.couponDiscount,
        };
      } else {
        state.coupon = null;
      }
      persist(state.items);
      persistCoupon(state.coupon);
    },
  },
});

export const {
  addToCart,
  addQuantity,
  updateQuantity,
  removeOne,
  removeFromCart,
  clearCart,
  applyLocalCoupon,
  removeLocalCoupon,
  hydrateCartFromServer,
} = cartSlice.actions;

export const selectSubtotal = (state: { cart: CartState }): number =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const selectItemDiscount = (state: { cart: CartState }): number =>
  state.cart.items.reduce(
    (sum, i) => sum + (i.price - effectivePriceOf(i)) * i.quantity,
    0
  );

export const selectDeliveryCharge = (state: { cart: CartState }): number => {
  const subtotal = selectSubtotal(state);
  if (state.cart.items.length === 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
};

export const selectCouponDiscount = (state: { cart: CartState }): number =>
  state.cart.coupon?.discount ?? 0;

export const selectCartTotal = (state: { cart: CartState }): number => {
  const subtotal = selectSubtotal(state);
  const itemDiscount = selectItemDiscount(state);
  const delivery = selectDeliveryCharge(state);
  const coupon = selectCouponDiscount(state);
  return Math.max(subtotal - itemDiscount - coupon + delivery, 0);
};

export const selectCartItemCount = (state: { cart: CartState }): number =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
