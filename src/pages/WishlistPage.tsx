import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCartPlus,
  FaHeart,
  FaShoppingBag,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import FoodCard from "../components/food/FoodCard";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import {
  addToWishlist,
  hydrateWishlistFromServer,
  removeFromWishlist,
  selectWishlistCount,
} from "../redux/wishlistSlice";
import {
  addQuantity,
  hydrateCartFromServer,
} from "../redux/cardSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  useGetWishlistQuery,
  useMoveWishlistToCartMutation,
  useRemoveFromWishlistMutation,
} from "../redux/api/wishlistApi";
import { useGetCartQuery } from "../redux/api/cartApi";
import type { IFood } from "../types/food";

const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = !!user;

  const localItems = useAppSelector((s) => s.wishlist.items);
  const localCount = useAppSelector(selectWishlistCount);

  const {
    data: serverWishlist,
    isFetching: isWishlistLoading,
    refetch: refetchWishlist,
  } = useGetWishlistQuery(void 0, {
    skip: !isLoggedIn,
    refetchOnMountOrArgChange: true,
  });
  const { data: serverCart, refetch: refetchCart } = useGetCartQuery(void 0, {
    skip: !isLoggedIn,
    refetchOnMountOrArgChange: true,
  });

  const [removeServerItem] = useRemoveFromWishlistMutation();
  const [moveToCartServer, { isLoading: isMoving }] =
    useMoveWishlistToCartMutation();

  useEffect(() => {
    if (isLoggedIn && serverWishlist) {
      dispatch(hydrateWishlistFromServer({ foods: serverWishlist.foods }));
    }
  }, [isLoggedIn, serverWishlist, dispatch]);

  useEffect(() => {
    if (isLoggedIn && serverCart) {
      dispatch(
        hydrateCartFromServer({
          items: serverCart.items.map((ci) => ({
            ...ci.foodId,
            quantity: ci.quantity,
          })),
          couponCode: serverCart.couponCode,
          couponDiscount: serverCart.couponDiscount,
        })
      );
    }
  }, [isLoggedIn, serverCart, dispatch]);

  const items: IFood[] = isLoggedIn
    ? serverWishlist?.foods ?? localItems
    : localItems;

  const count = isLoggedIn ? serverWishlist?.totalItems ?? localCount : localCount;
  const loading = isLoggedIn && isWishlistLoading;

  const handleRemove = async (food: IFood) => {
    dispatch(removeFromWishlist(food._id));
    if (isLoggedIn) {
      try {
        await removeServerItem(food._id).unwrap();
      } catch (err) {
        dispatch(addToWishlist(food));
        toast.error(
          (err as { data?: { message?: string } })?.data?.message ??
            "Server sync failed"
        );
      }
    }
  };

  const handleMoveToCart = async (food: IFood) => {
    if (isLoggedIn) {
      try {
        const after = await moveToCartServer(food._id).unwrap();
        dispatch(hydrateWishlistFromServer({ foods: after.foods }));
        await refetchCart();
        toast.success(`${food.name} moved to cart`);
      } catch (err) {
        toast.error(
          (err as { data?: { message?: string } })?.data?.message ??
            "Could not move to cart"
        );
      }
    } else {
      dispatch(addQuantity({ food, quantity: 1 }));
      dispatch(removeFromWishlist(food._id));
      toast.success(`${food.name} moved to cart`);
    }
  };

  if (loading) {
    return (
      <section className="container-app py-16">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (count === 0) {
    return (
      <section className="container-app py-16">
        <EmptyState
          icon={<FaHeart />}
          title="Your wishlist is empty"
          message="Save meals you love here. Tap the heart on any dish."
          action={
            <Link to="/menu" className="btn-primary">
              Browse menu
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="container-app py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/menu"
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand"
          >
            <FaArrowLeft size={12} /> Back to menu
          </Link>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900">
            <FaHeart className="text-red-500" /> Your Wishlist
            <span className="badge bg-red-100 text-red-600">{count}</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {count} saved {count === 1 ? "dish" : "dishes"} saved for later
          </p>
        </div>
        {isLoggedIn && (
          <button
            onClick={() => {
              void refetchWishlist();
            }}
            className="text-sm font-semibold text-brand hover:underline"
          >
            Refresh
          </button>
        )}
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((food) => (
          <div key={food._id} className="group relative">
            <FoodCard food={food} />
            <div className="mt-3 grid grid-cols-2 gap-2 px-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:px-2 md:pb-1 md:opacity-100">
              <button
                onClick={() => handleMoveToCart(food)}
                disabled={isMoving || !food.availability || food.stock <= 0}
                className="btn-primary !py-2 !text-xs flex items-center justify-center gap-1.5"
              >
                <FaCartPlus size={12} /> Move to cart
              </button>
              <button
                onClick={() => handleRemove(food)}
                className="flex items-center justify-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-100"
              >
                <FaTrash size={12} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand">
            <FaHeart size={16} />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-gray-900">
              {count} saved
            </p>
            <p className="text-xs text-gray-500">dishes in your wishlist</p>
          </div>
        </div>
        <div className="card flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
          <FaCartPlus size={16} />
        </div>
          <div>
            <p className="font-display text-lg font-bold text-gray-900">
              Move all
            </p>
            <p className="text-xs text-gray-500">tap "Move to cart" to order</p>
          </div>
        </div>
        <div className="card flex items-start gap-3 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <FaShoppingBag size={16} />
        </div>
          <div>
            <p className="font-display text-lg font-bold text-gray-900">
              Any device
            </p>
            <p className="text-xs text-gray-500">
              {isLoggedIn ? "Synced to your account" : "Login for cloud sync"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WishlistPage;
