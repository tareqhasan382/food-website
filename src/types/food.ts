export interface IFood {
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

export interface ICartItem extends IFood {
  quantity: number;
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
