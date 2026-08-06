import type { OrderStatus } from "../types/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-violet-100 text-violet-700",
  out_for_delivery: "bg-sky-100 text-sky-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const CANCELABLE_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
];

export const isCancellable = (status: OrderStatus): boolean =>
  CANCELABLE_STATUSES.includes(status);

export const statusProgress = (status: OrderStatus): number => {
  const index = ORDER_STATUS_STEPS.indexOf(status);
  return index === -1 ? 0 : index;
};
