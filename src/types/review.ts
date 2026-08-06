export interface IReviewUser {
  _id: string;
  name: string;
  profileImg?: string;
}

export interface IReview {
  _id: string;
  foodId: string;
  user: IReviewUser;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface IReviewWithFood {
  _id: string;
  userId: string;
  food: {
    _id: string;
    name: string;
    image?: string;
  };
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface IReviewSummary {
  averageRating: number;
  ratingCount: number;
}

export interface IReviewMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetFoodReviewsResult {
  summary: IReviewSummary;
  reviews: IReview[];
  meta: IReviewMeta;
}

export interface ICreateReviewArgs {
  foodId: string;
  rating: number;
  comment?: string;
}

export interface IUpdateReviewArgs {
  reviewId: string;
  foodId: string;
  rating?: number;
  comment?: string;
}

export interface IDeleteReviewArgs {
  reviewId: string;
  foodId: string;
}
