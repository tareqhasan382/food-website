import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCartPlus,
  FaCheck,
  FaMinus,
  FaPercent,
  FaPlus,
  FaTag,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
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
} from "../../redux/cardSlice";
import {
  useApplyCouponMutation,
  useRemoveCouponMutation,
} from "../../redux/api/cartApi";
import type { ICartItem } from "../../types/food";
import { foodImage } from "../../utils/food-image";
import Spinner from "../ui/Spinner";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const items = useAppSelector((state) => state.cart.items);
  const coupon = useAppSelector((state) => state.cart.coupon);
  const subtotal = useAppSelector(selectSubtotal);
  const itemDiscount = useAppSelector(selectItemDiscount);
  const deliveryFee = useAppSelector(selectDeliveryCharge);
  const couponDiscount = useAppSelector(selectCouponDiscount);
  const total = useAppSelector(selectCartTotal);

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyCouponApi, { isLoading: isApplying }] = useApplyCouponMutation();
  const [removeCouponApi, { isLoading: isRemovingCoupon }] =
    useRemoveCouponMutation();

  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleAdd = (item: ICartItem): void => {
    dispatch(addToCart(item));
  };

  const handleRemoveOne = (item: ICartItem): void => {
    dispatch(removeOne(item));
  };

  const handleRemove = (item: ICartItem): void => {
    dispatch(removeFromCart(item));
  };

  const handleApplyCoupon = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCouponError(null);
    const trimmed = couponCode.trim();
    if (!trimmed) return;
    if (!isLoggedIn) return;
    try {
      const result = await applyCouponApi({ code: trimmed }).unwrap();
      dispatch(
        applyLocalCoupon({
          code: result.couponCode ?? trimmed,
          discount: result.couponDiscount,
        })
      );
      setCouponCode("");
    } catch (err) {
      setCouponError(
        (err as { data?: { message?: string } })?.data?.message ??
          "Invalid coupon"
      );
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

  return (
    <>
      {isOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300"
        />
      )}

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col transform bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand">
              <FaCartPlus size={16} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">
                Your Cart
              </h2>
              <p className="text-xs text-gray-500">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close cart"
          >
            <FaXmark size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-4xl text-gray-200">
                <FaCartPlus size={48} />
              </div>
              <p className="text-sm font-medium text-gray-500">
                Your cart is empty
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Add some delicious items to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 rounded-xl bg-gray-50 p-3"
                >
                  <img
                    src={foodImage(item)}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {item.name ?? "Item"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ${Number(item.price ?? 0).toFixed(2)} each
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-brand">
                      ${(Number(item.price ?? 0) * Number(item.quantity ?? 1)).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center rounded-full bg-white ring-1 ring-gray-200">
                      <button
                        onClick={() => handleRemoveOne(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:text-brand"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">
                        {item.quantity ?? 1}
                      </span>
                      <button
                        onClick={() => handleAdd(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:text-brand"
                        aria-label="Increase quantity"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600"
                    >
                      <FaTrash size={10} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-4">
            {coupon ? (
              <div className="mb-3 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
                    <FaCheck size={10} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand">
                      {coupon.code}
                    </p>
                    <p className="text-[10px] text-brand-700">
                      -${couponDiscount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleRemoveCoupon()}
                  disabled={isRemovingCoupon}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-brand-700 hover:bg-brand-100 disabled:opacity-50"
                  aria-label="Remove coupon"
                >
                  <FaXmark size={13} />
                </button>
              </div>
            ) : isLoggedIn ? (
              <form
                onSubmit={(e) => void handleApplyCoupon(e)}
                className="mb-3 space-y-1.5"
              >
                <label
                  htmlFor="drawer-coupon"
                  className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500"
                >
                  <FaTag size={10} /> Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    id="drawer-coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    disabled={isApplying}
                    className="input !py-2 text-sm uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="btn-primary !px-4 !py-2 !text-sm shrink-0 disabled:opacity-60"
                  >
                    {isApplying ? <Spinner size="sm" /> : "Apply"}
                  </button>
                </div>
                {couponError && <p className="field-error">{couponError}</p>}
              </form>
            ) : (
              <p className="mb-3 rounded-lg bg-brand-50 px-3 py-2 text-[11px] text-brand-700">
                <Link to="/login" onClick={onClose} className="font-semibold underline">
                  Log in
                </Link>{" "}
                to use promo codes.
              </p>
            )}

            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-semibold text-gray-900">
                  ${subtotal.toFixed(2)}
                </dd>
              </div>
              {itemDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt className="flex items-center gap-1">
                    <FaPercent size={10} /> Item discount
                  </dt>
                  <dd className="font-semibold">-${itemDiscount.toFixed(2)}</dd>
                </div>
              )}
              {coupon && couponDiscount > 0 && (
                <div className="flex justify-between text-brand">
                  <dt className="flex items-center gap-1">
                    <FaTag size={10} /> Coupon ({coupon.code})
                  </dt>
                  <dd className="font-semibold">-${couponDiscount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Delivery</dt>
                <dd
                  className={`font-semibold ${
                    deliveryFee === 0 ? "text-green-600" : "text-gray-900"
                  }`}
                >
                  {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                </dd>
              </div>
              {deliveryFee > 0 && (
                <p className="rounded-lg bg-brand-50 px-3 py-1.5 text-[11px] text-brand-700">
                  Add ${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more
                  for FREE delivery
                </p>
              )}
              <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base">
                <dt className="font-display font-bold text-gray-900">Total</dt>
                <dd className="font-extrabold text-brand">${total.toFixed(2)}</dd>
              </div>
            </dl>

            <Link
              to="/cart"
              onClick={onClose}
              className="mt-3 block text-center text-sm font-semibold text-brand hover:underline"
            >
              View full cart →
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="mt-3 block w-full rounded-full bg-brand py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-600"
            >
              Proceed to Checkout · ${total.toFixed(2)}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
