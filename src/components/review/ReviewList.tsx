import type { IReview } from "../../types/review";
import StarRating from "./StarRating";

interface ReviewListProps {
  reviews: IReview[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => (
  <div className="space-y-4">
    {reviews.map((review) => (
      <div key={review._id} className="card p-5">
        <div className="flex items-start gap-4">
          {review.user.profileImg ? (
            <img
              src={review.user.profileImg}
              alt={review.user.name}
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-lg font-bold text-brand">
              {review.user.name.charAt(0).toUpperCase()}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-gray-900">
                {review.user.name}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt ?? Date.now()).toLocaleString()}
              </span>
            </div>

            <div className="mt-1">
              <StarRating value={review.rating} size={13} />
            </div>

            {review.comment && (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ReviewList;
