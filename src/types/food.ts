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
