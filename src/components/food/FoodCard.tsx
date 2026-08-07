import { memo } from "react";
import { Link } from "react-router-dom";
import { FaCartPlus, FaStar } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCart, removeOne } from "../../redux/cardSlice";
import { useAddItemToCartMutation } from "../../redux/api/cartApi";
import type { IFood } from "../../types/food";
import toast from "react-hot-toast";
import { foodImage } from "../../utils/food-image";
import WishlistHeartButton from "./WishlistHeartButton";
import CategoryLabel from "../category/CategoryLabel";

const FoodCard: React.FC<{ food: IFood }> = memo(({ food }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const [addItemServer] = useAddItemToCartMutation();

  const soldOut = !food.availability || (food.stock ?? 0) <= 0;
  const price = Number(food.price) || 0;
  const discountPrice = Number(food.discountPrice) || 0;
  const rating = Number(food.rating) || 0;
  const ratingCount = Number(food.ratingCount) || 0;
  const hasDiscount = discountPrice > 0 && discountPrice < price;

  const handleAdd = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(food));
    if (isLoggedIn) {
      try {
        await addItemServer({ foodId: food._id, quantity: 1 }).unwrap();
      } catch (err) {
        dispatch(removeOne(food));
        const msg =
          (err as { data?: { message?: string } })?.data?.message ??
          "Server sync failed";
        toast.error(msg);
      }
    }
  };

  return (
    <Link
      to={`/food/${food._id}`}
      className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={foodImage(food)}
          alt={food.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <WishlistHeartButton food={food} variant="card" />
        {hasDiscount && (
          <span className="badge absolute left-3 top-3 bg-red-500 text-white shadow">
            Save ${(price - discountPrice).toFixed(2)}
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="badge bg-red-600 text-white">Sold out</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold text-gray-900">
              {food.name}
            </h3>
            <p className="text-xs font-medium uppercase tracking-wide text-brand">
              <CategoryLabel slug={food.category} />
            </p>
          </div>
          <div className="shrink-0 text-right">
            {hasDiscount ? (
              <>
                <p className="text-lg font-extrabold text-gray-900">
                  ${discountPrice.toFixed(2)}
                </p>
                <p className="text-xs font-medium text-gray-400 line-through">
                  ${price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-lg font-extrabold text-gray-900">
                ${price.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
          {food.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
            <FaStar className="text-amber-400" />
            {rating.toFixed(1)}
            <span className="font-normal text-gray-400">
              ({ratingCount})
            </span>
          </span>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className="btn-primary !px-3 !py-2"
            aria-label={`Add ${food.name} to cart`}
          >
            <FaCartPlus size={14} />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
});

export default FoodCard;
