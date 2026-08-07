export interface IPromotion {
  _id: string;
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  validUntil?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreatePromotionPayload {
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  validUntil?: string;
  isActive?: boolean;
}
