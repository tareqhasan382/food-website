import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  FaCheck,
  FaMinus,
  FaPercent,
  FaPlus,
  FaTag,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  FREE_DELIVERY_THRESHOLD,
  addToCart,
  applyLocalCoupon,
  removeFromCart,
  removeLocalCoupon,
  removeOne,
  selectCartTotal,
  selectCouponDiscount,
  selectDeliveryCharge,
  selectItemDiscount,
  selectSubtotal,
  updateQuantity,
} from "../redux/cardSlice";
import {
  useAddItemToCartMutation,
  useApplyCouponMutation,
  useGetCartQuery,
  useRemoveCouponMutation,
  useRemoveItemFromCartMutation,
  useUpdateCartQuantityMutation,
} from "../redux/api/cartApi";
import EmptyState from "../components/ui/EmptyState";
import type { ICartItem } from "../types/food";
import Spinner from "../components/ui/Spinner";
import { foodImage } from "../utils/food-image";

interface CouponForm {
  code: string;
}

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;

  const localItems = useAppSelector((state) => state.cart.items);
  const localCoupon = useAppSelector((state) => state.cart.coupon);
  const localSubtotal = useAppSelector(selectSubtotal);
  const localItemDiscount = useAppSelector(selectItemDiscount);
  const localDeliveryFee = useAppSelector(selectDeliveryCharge);
  const localCouponDiscount = useAppSelector(selectCouponDiscount);
  const localTotal = useAppSelector(selectCartTotal);

  const { data: serverCart, isFetching: isCartFetching } = useGetCartQuery(
    void 0,
    { skip: !isLoggedIn, refetchOnMountOrArgChange: true }
  );

  const [applyCouponApi, { isLoading: isApplying }] = useApplyCouponMutation();
  const [removeCouponApi, { isLoading: isRemovingCoupon }] =
    useRemoveCouponMutation();
  const [addItemServer] = useAddItemToCartMutation();
  const [updateQtyServer, { isLoading: isUpdatingQty }] =
    useUpdateCartQuantityMutation();
  const [removeItemServer, { isLoading: isRemovingItem }] =
    useRemoveItemFromCartMutation();

  const anyServerAction = isUpdatingQty || isRemovingItem;

  const {
    register: couponRegister,
    handleSubmit: handleCouponSubmit,
    reset: resetCoupon,
    formState: { errors: couponErrors },
  } = useForm<CouponForm>();

  const [qtyInputs, setQtyInputs] = useState<Record<string, string>>({});

  const items: ICartItem[] = isLoggedIn
    ? (serverCart?.items ?? []).map((ci) => ({
        ...ci.foodId,
        quantity: ci.quantity,
      }))
    : localItems;

  const subtotal = isLoggedIn ? serverCart?.subtotal ?? 0 : localSubtotal;
  const itemDiscount = isLoggedIn
    ? serverCart?.discount ?? 0
    : localItemDiscount;
  const deliveryFee = isLoggedIn
    ? serverCart?.deliveryCharge ?? 0
    : localDeliveryFee;
  const appliedCouponCode = isLoggedIn
    ? serverCart?.couponCode
    : localCoupon?.code;
  const couponDiscount = isLoggedIn
    ? serverCart?.couponDiscount ?? 0
    : localCouponDiscount;
  const total = isLoggedIn ? serverCart?.total ?? 0 : localTotal;
  const itemsLoaded = isLoggedIn ? !isCartFetching : true;

  const handleCheckout = (): void => {
    if (!isLoggedIn) {
      toast.info("Please log in to checkout.");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const onCouponSubmit: SubmitHandler<CouponForm> = async ({ code }) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    if (!isLoggedIn) {
      toast.info("Please log in to use coupons.");
      navigate("/login");
      return;
    }
    try {
      const result = await applyCouponApi({ code: trimmed }).unwrap();
      dispatch(
        applyLocalCoupon({
          code: result.couponCode ?? trimmed,
          discount: result.couponDiscount,
        })
      );
      resetCoupon();
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Invalid coupon";
      toast.error(message);
    }
  };

  const handleRemoveCoupon = async (): Promise<void> => {
    try {
      if (isLoggedIn) {
        await removeCouponApi().unwrap();
      }
      dispatch(removeLocalCoupon());
    } catch {
      dispatch(removeLocalCoupon());
    }
  };

  const handleIncQty = async (item: ICartItem): Promise<void> => {
    if (isLoggedIn) {
      try {
        await addItemServer({ foodId: item._id, quantity: 1 }).unwrap();
      } catch (err) {
        const msg =
          (err as { data?: { message?: string } })?.data?.message ??
          "Could not update";
        toast.error(msg);
      }
    } else {
      dispatch(addToCart(item));
    }
  };

  const handleDecQty = async (item: ICartItem): Promise<void> => {
    if (isLoggedIn) {
      const nextQty = item.quantity - 1;
      try {
        if (nextQty <= 0) {
          await removeItemServer(item._id).unwrap();
        } else {
          await updateQtyServer({ foodId: item._id, quantity: nextQty }).unwrap();
        }
      } catch (err) {
        const msg =
          (err as { data?: { message?: string } })?.data?.message ??
          "Could not update";
        toast.error(msg);
      }
    } else {
      dispatch(removeOne(item));
    }
  };

  const handleRemoveItem = async (item: ICartItem): Promise<void> => {
    if (isLoggedIn) {
      try {
        await removeItemServer(item._id).unwrap();
      } catch (err) {
        const msg =
          (err as { data?: { message?: string } })?.data?.message ??
          "Could not remove";
        toast.error(msg);
      }
    } else {
      dispatch(removeFromCart(item));
    }
  };

  const handleSetQty = async (item: ICartItem, raw: string): Promise<void> => {
    const qty = Math.floor(Number(raw));
    if (Number.isNaN(qty) || qty <= 0) {
      await handleRemoveItem(item);
      return;
    }
    const capped = Math.min(qty, item.stock);
    if (isLoggedIn) {
      try {
        await updateQtyServer({ foodId: item._id, quantity: capped }).unwrap();
      } catch (err) {
        const msg =
          (err as { data?: { message?: string } })?.data?.message ??
          "Could not update";
        toast.error(msg);
      }
    } else {
      dispatch(updateQuantity({ foodId: item._id, quantity: capped }));
    }
  };

  if (!itemsLoaded) {
    return (
      <section className="container-app py-16">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-app py-16">
        <EmptyState
          icon={<FaShoppingCart />}
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Explore our menu and find something delicious."
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
      <h1 className="mb-8 font-display text-3xl font-bold text-gray-900">
        Your Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          {items.map((item: ICartItem) => {
                const itemPrice = Number(
                  (item as ICartItem).price ?? 0
                );
                const itemDiscountPrice = Number(
                  (item as ICartItem).discountPrice ?? Number.POSITIVE_INFINITY
                );
                const hasDiscount =
                  (item as ICartItem).discountPrice !== undefined &&
                  itemDiscountPrice < itemPrice;
                const effectivePrice = hasDiscount
                  ? itemDiscountPrice
                  : itemPrice;
                const qty = Number((item as ICartItem).quantity ?? 1);
                const qtyValue =
                  qtyInputs[item._id] !== undefined
                    ? qtyInputs[item._id]
                    : String(qty);
                return (
                  <div
                    key={item._id}
                    className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                  >
                    <img
                      src={foodImage(item as ICartItem)}
                      alt={(item as ICartItem).name ?? "Item"}
                      className="h-24 w-24 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-gray-900">
                        {(item as ICartItem).name ?? "Item"}
                      </h3>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        {hasDiscount ? (
                          <>
                            <p className="text-sm font-bold text-brand">
                              ${effectivePrice.toFixed(2)} each
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              ${itemPrice.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">
                            ${itemPrice.toFixed(2)} each
                          </p>
                        )}
                      </div>
                      <p className="mt-1 text-base font-extrabold text-gray-900">
                        ${(effectivePrice * qty).toFixed(2)}
                      </p>
                    </div>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center rounded-full bg-gray-100">
                    <button
                      onClick={() => handleDecQty(item)}
                      disabled={anyServerAction}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:text-brand disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={12} />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={qtyValue}
                      onChange={(e) =>
                        setQtyInputs((s) => ({
                          ...s,
                          [item._id]: e.target.value.replace(/[^0-9]/g, ""),
                        }))
                      }
                      onBlur={() => handleSetQty(item, qtyValue)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSetQty(item, qtyValue);
                      }}
                      className="w-10 bg-transparent text-center text-sm font-bold outline-none"
                      aria-label={`${(item as ICartItem).name ?? "Item"} quantity`}
                    />
                    <button
                      onClick={() => handleIncQty(item)}
                      disabled={anyServerAction}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:text-brand disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    disabled={isRemovingItem}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-50"
                    aria-label="Remove item"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-gray-900">
              <FaTag className="text-brand" /> Promo Code
            </h2>
            {appliedCouponCode ? (
              <div className="flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
                    <FaCheck size={12} />
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-brand">
                      {appliedCouponCode}
                    </p>
                    <p className="text-[11px] text-brand-700">Applied</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  disabled={isRemovingCoupon}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand-700 hover:bg-brand-100 disabled:opacity-50"
                  aria-label="Remove coupon"
                >
                  <FaXmark size={14} />
                </button>
              </div>
            ) : !isLoggedIn ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-gray-500">
                  Log in to apply promo codes and save on your order.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="btn-outline"
                >
                  Log in to use coupons
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleCouponSubmit(onCouponSubmit)}
                className="space-y-2"
              >
                <div className="flex gap-2">
                  <input
                    {...couponRegister("code", {
                      required: "Enter a code",
                      minLength: { value: 3, message: "Too short" },
                    })}
                    className="input flex-1 uppercase"
                    placeholder="e.g. WELCOME10"
                    disabled={isApplying}
                  />
                  <button
                    type="submit"
                    className="btn-primary !px-5"
                    disabled={isApplying}
                  >
                    {isApplying ? <Spinner size="sm" /> : "Apply"}
                  </button>
                </div>
                {couponErrors.code && (
                  <p className="field-error">{couponErrors.code.message}</p>
                )}
              </form>
            )}
          </div>

          <div className="card h-fit p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-gray-900">
              Order Summary
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </dt>
                <dd className="font-semibold">${subtotal.toFixed(2)}</dd>
              </div>
              {itemDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt className="flex items-center gap-1.5">
                    <FaPercent size={11} /> Item discount
                  </dt>
                  <dd className="font-semibold">-${itemDiscount.toFixed(2)}</dd>
                </div>
              )}
              {appliedCouponCode && couponDiscount > 0 && (
                <div className="flex justify-between text-brand">
                  <dt className="flex items-center gap-1.5">
                    <FaTag size={11} /> Coupon ({appliedCouponCode})
                  </dt>
                  <dd className="font-semibold">-${couponDiscount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Delivery fee</dt>
                <dd
                  className={`font-semibold ${
                    deliveryFee === 0 ? "text-green-600" : ""
                  }`}
                >
                  {deliveryFee === 0 ? (
                    <span>FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </dd>
              </div>
              {deliveryFee > 0 && (
                <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
                  Add ${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more
                  for FREE delivery.
                </p>
              )}
              <div className="my-2 border-t border-dashed border-gray-200" />
              <div className="flex justify-between text-base">
                <dt className="font-display font-bold text-gray-900">Total</dt>
                <dd className="font-extrabold text-brand text-lg">
                  ${total.toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleCheckout}
                className="btn-primary w-full"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/menu"
                className="block text-center text-sm font-semibold text-gray-500 hover:text-brand"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
