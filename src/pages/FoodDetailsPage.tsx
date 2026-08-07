import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCartPlus,
  FaClock,
  FaFire,
  FaLeaf,
  FaMinus,
  FaPlus,
  FaStar,
} from "react-icons/fa";
import { useGetFoodQuery } from "../redux/api/foodApi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addQuantity, updateQuantity } from "../redux/cardSlice";
import { store } from "../redux/store";
import { useAddItemToCartMutation } from "../redux/api/cartApi";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import CategoryLabel from "../components/category/CategoryLabel";
import toast from "react-hot-toast";
import { foodImage } from "../utils/food-image";
import WishlistHeartButton from "../components/food/WishlistHeartButton";
import ReviewSection from "../components/review/ReviewSection";

const FoodDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const [addItemServer] = useAddItemToCartMutation();

  const { data: food, isFetching, isError, refetch } = useGetFoodQuery(id ?? "", {
    skip: !id,
  });

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isFetching) {
    return (
      <section className="container-app py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-12 w-56 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container-app py-12">
        <ErrorState
          title="Couldn't load this dish"
          message="We hit a snag while fetching this dish. Please try again."
          onRetry={refetch}
        />
      </section>
    );
  }

  if (!food) {
    return (
      <section className="container-app py-12">
        <EmptyState
          title="Dish not found"
          message="This dish may have been removed from the menu."
          action={
            <Link to="/menu" className="btn-primary">
              Back to menu
            </Link>
          }
        />
      </section>
    );
  }

  const soldOut = !food.availability || food.stock <= 0;
  const hasDiscount =
    food.discountPrice !== undefined && food.discountPrice < food.price;
  const price = hasDiscount ? (food.discountPrice ?? food.price) : food.price;
  const fallbackImages = [foodImage(food)];
  const images =
    Array.isArray(food.images) && food.images.length > 0
      ? food.images
      : fallbackImages;

  const handleAdd = async (): Promise<void> => {
    const prevQty =
      store.getState().cart.items.find((i) => i._id === food._id)?.quantity ?? 0;
    dispatch(addQuantity({ food, quantity }));
    if (isLoggedIn) {
      try {
        await addItemServer({ foodId: food._id, quantity }).unwrap();
      } catch (err) {
        dispatch(updateQuantity({ foodId: food._id, quantity: prevQty }));
        const msg =
          (err as { data?: { message?: string } })?.data?.message ??
          "Server sync failed";
        toast.error(msg);
      }
    }
    setQuantity(1);
  };

  return (
    <section className="container-app py-12">
      <Link
        to="/menu"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand"
      >
        <FaArrowLeft size={13} /> Back to menu
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={images[activeImage]}
              alt={food.name}
              className="h-96 w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl ring-2 transition ${
                    i === activeImage
                      ? "ring-brand"
                      : "ring-transparent hover:ring-gray-300"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${food.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            <CategoryLabel slug={food.category} />
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-gray-900">
            {food.name}
          </h1>

          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FaStar className="text-amber-400" />
              <span className="font-semibold text-gray-800">
                {food.rating.toFixed(1)}
              </span>
              <span>({food.ratingCount ?? 0} reviews)</span>
            </span>
            {food.preparationTime > 0 && (
              <span className="flex items-center gap-1">
                <FaClock /> {food.preparationTime} min
              </span>
            )}
            {food.calories > 0 && (
              <span className="flex items-center gap-1">
                <FaFire /> {food.calories} cal
              </span>
            )}
          </div>

          <p className="mt-4 text-gray-600">{food.description}</p>

          <div className="mt-6 flex items-end gap-3">
            {hasDiscount ? (
              <>
                <p className="text-3xl font-extrabold text-gray-900">
                  ${price.toFixed(2)}
                </p>
                <p className="mb-1 text-lg font-semibold text-gray-400 line-through">
                  ${food.price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-3xl font-extrabold text-gray-900">
                ${food.price.toFixed(2)}
              </p>
            )}
            {soldOut ? (
              <span className="badge ml-2 bg-red-600 text-white">
                Sold out
              </span>
            ) : (
              food.stock <= 10 && (
                <span className="badge ml-2 bg-amber-100 text-amber-700">
                  Only {food.stock} left
                </span>
              )
            )}
          </div>

          {food.ingredients.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                <FaLeaf className="text-brand" /> Ingredients
              </h2>
              <ul className="flex flex-wrap gap-2">
                {food.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!soldOut && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <WishlistHeartButton food={food} variant="details" iconSize={16} />
              <div className="flex items-center rounded-full bg-gray-100">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:text-brand"
                  aria-label="Decrease quantity"
                >
                  <FaMinus size={13} />
                </button>
                <span className="w-10 text-center text-base font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(food.stock, q + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:text-brand"
                  aria-label="Increase quantity"
                >
                  <FaPlus size={13} />
                </button>
              </div>
              <button onClick={handleAdd} className="btn-primary !px-6">
                <FaCartPlus size={15} /> Add to cart · ${(
                  price * quantity
                ).toFixed(2)}
              </button>
            </div>
          )}
        </div>
      </div>

      <ReviewSection key={food._id} foodId={food._id} />
    </section>
  );
};

export default FoodDetailsPage;
