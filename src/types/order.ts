export type PaymentStatus =
  | "pending"
  | "requires_payment_method"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "failed"
  | "canceled"
  | "refunded"
  | "partially_refunded";

export interface IPaymentRefund {
  refundId: string;
  amount: number;
  status: string;
  reason?: string;
  createdAt: string;
}

export interface IPayment {
  _id: string;
  userId: string;
  paymentIntentId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  failureReason?: string;
  failureCode?: string;
  paidAt?: string;
  metadata?: Record<string, unknown>;
  refunds: IPaymentRefund[];
}

export interface IDeliveryAddress {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  foodId: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image?: string;
  lineTotal: number;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  note?: string;
  changedAt: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  couponCode?: string;
  couponDiscount?: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  deliveryAddress?: IDeliveryAddress;
  statusHistory: IOrderStatusHistory[];
  createdAt?: string;
}
