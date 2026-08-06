export type FoodCategory = string;

export interface IFood {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: FoodCategory;
  images: string[];
  stock: number;
  ingredients: string[];
  preparationTime: number;
  calories: number;
  rating: number;
  averageRating?: number;
  ratingCount?: number;
  availability: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICartItem extends IFood {
  quantity: number;
}

export interface IGetFoodsArgs {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: "price" | "rating" | "newest" | "oldest";
  sortOrder?: "asc" | "desc";
  popular?: boolean;
  availability?: boolean;
}

export interface IFoodsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetFoodsResult {
  foods: IFood[];
  meta: IFoodsMeta;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface IPromotion {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  validUntil: string;
}

export interface ITestimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
}

export interface IOrder {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "pending" | "preparing" | "out-for-delivery" | "delivered" | "cancelled";
  placedAt: string;
}

export interface IAppliedCoupon {
  code: string;
  discount: number;
  type?: "percentage" | "fixed";
}

export interface ICartSummary {
  subtotal: number;
  itemDiscount: number;
  deliveryCharge: number;
  couponDiscount: number;
  total: number;
}

export interface ILocalFood {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  tags: string[];
  available: boolean;
  featured: boolean;
}
