import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCommentDots, FaLock, FaPen, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/hooks";
import {
  useDeleteReviewMutation,
  useGetFoodReviewsQuery,
  useGetMyReviewsQuery,
} from "../../redux/api/reviewApi";
import type { IReviewWithFood } from "../../types/review";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";

const PAGE_SIZE = 5;

const getErrorMessage = (err: unknown): string =>
  (err as { data?: { message?: string } })?.data?.message ??
  "Something went wrong. Please try again.";

interface ReviewSectionProps {
  foodId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ foodId }) => {
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = !!user;

  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<IReviewWithFood | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data, isLoading, isError, refetch } = useGetFoodReviewsQuery({
    foodId,
    page,
    limit: PAGE_SIZE,
  });

  const { data: myReviews = [] } = useGetMyReviewsQuery(
    { limit: 100 },
    { skip: !isLoggedIn }
  );

  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const reviews = data?.reviews ?? [];
  const summary = data?.summary ?? { averageRating: 0, ratingCount: 0 };
  const meta = data?.meta ?? {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  };

  const myReview = isLoggedIn
    ? myReviews.find((r) => r.food._id === foodId)
    : undefined;

  const visibleReviews = myReview
    ? reviews.filter((r) => r.user._id !== user?._id)
    : reviews;

  const totalPages = Math.max(meta.totalPages, 1);

  const handleDelete = async (): Promise<void> => {
    if (!myReview) return;
    try {
      await deleteReview({ reviewId: myReview._id, foodId }).unwrap();
      setEditing(null);
      setConfirmingDelete(false);
      toast.success("Review deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const renderActionArea = (): React.ReactElement => {
    if (!isLoggedIn) {
      return (
        <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-display text-lg font-bold text-gray-900">
              Have you tried this dish?
            </p>
            <p className="mt-0.5 text-sm text-gray-500">
              Log in to share your rating and review.
            </p>
          </div>
          <Link to="/login" className="btn-primary shrink-0">
            Log in to review
          </Link>
        </div>
      );
    }

    if (user?.emailVerified === false) {
      return (
        <div className="card flex items-start gap-4 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <FaLock />
          </span>
          <div>
            <p className="font-semibold text-gray-900">
              Verify your email to write reviews
            </p>
            <p className="mt-0.5 text-sm text-gray-500">
              Only verified users can rate and review dishes.
            </p>
          </div>
        </div>
      );
    }

    if (editing && myReview) {
      return (
        <ReviewForm
          key={myReview._id}
          foodId={foodId}
          initialReview={{
            reviewId: myReview._id,
            rating: myReview.rating,
            comment: myReview.comment,
          }}
          onCancelEdit={() => setEditing(null)}
        />
      );
    }

    if (myReview) {
      return (
        <div className="card border-brand-100 bg-brand-50/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-gray-900">
                Your review
              </h3>
              <span className="badge bg-brand-100 text-brand">You</span>
            </div>
            {!confirmingDelete && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(myReview)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-brand"
                >
                  <FaPen size={11} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                >
                  <FaTrashAlt size={11} /> Delete
                </button>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StarRating value={myReview.rating} size={16} />
            <span className="text-xs text-gray-400">
              {new Date(myReview.createdAt ?? Date.now()).toLocaleString()}
            </span>
          </div>

          {myReview.comment && (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {myReview.comment}
            </p>
          )}

          {confirmingDelete && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-red-50 px-4 py-3">
              <span className="text-sm font-medium text-red-700">
                Delete this review? This can't be undone.
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="btn-primary !bg-red-600 !px-4 !py-1.5 !text-xs hover:!bg-red-700 disabled:opacity-60"
                >
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setConfirmingDelete(false)}
                  className="btn-outline !px-4 !py-1.5 !text-xs disabled:opacity-60"
                >
                  Keep
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return <ReviewForm foodId={foodId} />;
  };

  const renderReviews = (): React.ReactElement => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card animate-pulse p-5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/4 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError && reviews.length === 0) {
      return (
        <ErrorState
          title="Couldn't load reviews"
          message="We hit a snag while loading this dish's reviews. Please try again."
          onRetry={refetch}
        />
      );
    }

    if (visibleReviews.length === 0) {
      return myReview ? (
        <p className="text-sm text-gray-500">
          No reviews from other customers yet.
        </p>
      ) : (
        <EmptyState
          icon={<FaCommentDots />}
          title="No reviews yet"
          message="Be the first to rate and review this dish!"
        />
      );
    }

    return (
      <>
        <ReviewList reviews={visibleReviews} />
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="btn-outline disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="btn-outline disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="mt-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-gray-900">
            <FaCommentDots className="text-brand" /> Customer reviews
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Ratings and feedback from people who ordered this dish.
          </p>
        </div>
        {summary.ratingCount > 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-2.5">
            <span className="font-display text-3xl font-extrabold text-gray-900">
              {summary.averageRating.toFixed(1)}
            </span>
            <div>
              <StarRating value={summary.averageRating} size={15} />
              <p className="text-xs text-gray-500">
                {summary.ratingCount}{" "}
                {summary.ratingCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        )}
      </div>

      {renderActionArea()}

      <div className="mt-8">
        <h3 className="mb-4 font-display text-lg font-bold text-gray-900">
          All reviews
        </h3>
        {renderReviews()}
      </div>
    </section>
  );
};

export default ReviewSection;
