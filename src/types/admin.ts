import type { IMeta } from "./common";
import type { OrderStatus } from "./order";
import type { Role } from "./auth";

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  todayRevenue: number;
  todayOrders: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface OrdersPoint {
  date: string;
  orders: number;
}

export interface UsersPoint {
  date: string;
  users: number;
}

export interface BestSellingFood {
  foodId: string;
  name: string;
  image?: string;
  quantity: number;
  revenue: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  profileImg?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUsersMeta extends IMeta {
  totalPages: number;
}

export interface AdminUsersResult {
  users: AdminUser[];
  meta: AdminUsersMeta;
}

export type CouponType = "percentage" | "fixed";

export interface AdminCoupon {
  _id: string;
  code: string;
  type: CouponType;
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  minimumOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCouponsMeta extends IMeta {
  totalPages: number;
}

export interface AdminCouponsResult {
  coupons: AdminCoupon[];
  meta: AdminCouponsMeta;
}

export interface AdminCouponPayload {
  code: string;
  type: CouponType;
  value: number;
  expiryDate: string;
  usageLimit: number;
  minimumOrder?: number;
  isActive?: boolean;
}

export interface AdminOrderStats {
  totalOrders: number;
  revenue: number;
  statusCounts: Record<OrderStatus, number>;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: {
    foodId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    lineTotal: number;
  }[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  couponCode?: string;
  couponDiscount?: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  deliveryAddress?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  createdAt?: string;
}
