import { memo } from "react";
import { FaCartPlus, FaStar } from "react-icons/fa";
import { useAppDispatch } from "../../redux/hooks";
import { addToCart } from "../../redux/cardSlice";
import type { IFood } from "../../types/food";

const FoodCard: React.FC<{ food: IFood }> = memo(({ food }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {food.featured && (
          <span className="badge absolute left-3 top-3 bg-brand text-white shadow">
            Featured
          </span>
        )}
        {!food.available && (
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
              {food.category}
            </p>
          </div>
          <p className="shrink-0 text-lg font-extrabold text-gray-900">
            ${food.price.toFixed(2)}
          </p>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
          {food.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
            <FaStar className="text-amber-400" />
            {food.rating.toFixed(1)}
            <span className="font-normal text-gray-400">({food.reviews})</span>
          </span>
          <button
            onClick={() => dispatch(addToCart(food))}
            disabled={!food.available}
            className="btn-primary !px-3 !py-2"
            aria-label={`Add ${food.name} to cart`}
          >
            <FaCartPlus size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

export default FoodCard;
