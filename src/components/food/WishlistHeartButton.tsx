import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "../../redux/wishlistSlice";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../redux/api/wishlistApi";
import type { IFood } from "../../types/food";

interface WishlistHeartButtonProps {
  food: IFood;
  className?: string;
  iconSize?: number;
  variant?: "card" | "details";
}

const WishlistHeartButton: React.FC<WishlistHeartButtonProps> = ({
  food,
  className,
  iconSize = 14,
  variant = "card",
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const isSaved = useAppSelector((s) => selectIsInWishlist(s, food._id));
  const [addServer] = useAddToWishlistMutation();
  const [removeServer] = useRemoveFromWishlistMutation();
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (!burst) return;
    const t = window.setTimeout(() => setBurst(false), 700);
    return () => window.clearTimeout(t);
  }, [burst]);

  const handleToggle = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      dispatch(removeFromWishlist(food._id));
      if (isLoggedIn) {
        try {
          await removeServer(food._id).unwrap();
        } catch (err) {
          dispatch(addToWishlist(food));
          const msg =
            (err as { data?: { message?: string } })?.data?.message ??
            "Sync failed";
          toast.error(msg);
        }
      }
    } else {
      dispatch(addToWishlist(food));
      setBurst(true);
      if (isLoggedIn) {
        try {
          await addServer(food._id).unwrap();
        } catch (err) {
          dispatch(removeFromWishlist(food._id));
          const msg =
            (err as { data?: { message?: string } })?.data?.message ??
            "Sync failed";
          toast.error(msg);
        }
      }
    }
  };

  const baseClasses =
    variant === "card"
      ? "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition"
      : "flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      className={`${baseClasses} ${className ?? ""} group`}
    >
      <span
        className={`relative inline-flex items-center justify-center transition-transform duration-500 ${
          burst ? "animate-wishlist-burst" : ""
        }`}
      >
        <FaHeart
          size={iconSize}
          className={`transition-all duration-300 ${
            isSaved
              ? "fill-red-500 text-red-500 scale-100"
              : " text-gray-500 outline-1 group-hover:text-red-400"
          }`}
        />
        {burst && (
          <span
            className="pointer-events-none absolute inset-0 -m-2 rounded-full ring-2 ring-red-400/60"
            style={{ animation: "wishlist-ring 0.7s ease-out forwards" }}
          />
        )}
      </span>
    </button>
  );
};

export default WishlistHeartButton;
