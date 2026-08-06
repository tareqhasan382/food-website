import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "../../redux/api/reviewApi";
import StarRating from "./StarRating";
import Spinner from "../ui/Spinner";

const getErrorMessage = (err: unknown): string =>
  (err as { data?: { message?: string } })?.data?.message ??
  "Couldn't submit your review. Please try again.";

interface ReviewFormProps {
  foodId: string;
  initialReview?: { reviewId: string; rating: number; comment?: string };
  onCancelEdit?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  foodId,
  initialReview,
  onCancelEdit,
}) => {
  const isEdit = !!initialReview;
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [rating, setRating] = useState(initialReview?.rating ?? 0);
  const [comment, setComment] = useState(initialReview?.comment ?? "");
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Please select a star rating before submitting.");
      return;
    }

    const trimmed = comment.trim() || undefined;

    try {
      if (isEdit && initialReview) {
        await updateReview({
          reviewId: initialReview.reviewId,
          foodId,
          rating,
          comment: trimmed,
        }).unwrap();
        toast.success("Review updated!");
        onCancelEdit?.();
      } else {
        await createReview({ foodId, rating, comment: trimmed }).unwrap();
        toast.success("Thanks for your review!");
        setRating(0);
        setComment("");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-4 border-brand-100 bg-brand-50/40 p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-gray-900">
            {isEdit ? "Edit your review" : "Write a review"}
          </h3>
          <p className="text-xs text-gray-500">
            {isEdit
              ? "Adjust your rating or feedback."
              : "Share your experience with this dish."}
          </p>
        </div>
        <StarRating value={rating} onChange={setRating} size={26} />
      </div>

      <div>
        <label htmlFor="review-comment" className="label">
          Your feedback (optional)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="What did you like or dislike?"
          className="input resize-none"
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {comment.length}/1000
        </p>
      </div>

      {error && <p className="field-error">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-60"
        >
          {isSubmitting ? (
            <Spinner size="sm" />
          ) : (
            <FaPaperPlane size={13} />
          )}
          {isEdit ? "Update review" : "Submit review"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="btn-outline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
