import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import {
  FaCreditCard,
  FaLocationDot,
  FaLock,
  FaPercent,
  FaTag,
} from "react-icons/fa6";
import { useGetCartQuery } from "../redux/api/cartApi";
import type { ICartResponse } from "../redux/api/cartApi";
import {
  useCreatePaymentIntentMutation,
  useVerifyPaymentMutation,
} from "../redux/api/paymentApi";
import { useCreateOrderMutation } from "../redux/api/orderApi";
import type { IDeliveryAddress } from "../types/order";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Spinner from "../components/ui/Spinner";
import { useAppDispatch } from "../redux/hooks";
import { clearCart } from "../redux/cardSlice";

const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

interface IntentInfo {
  paymentId: string;
  clientSecret: string;
}

const waitForSucceeded = async (
  pollFn: () => Promise<unknown>,
  isSucceeded: (data: unknown) => boolean,
  isFailed: (data: unknown) => boolean,
  opts: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<boolean> => {
  const { timeoutMs = 15000, intervalMs = 750 } = opts;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const latest = await pollFn();
      if (isSucceeded(latest)) return true;
      if (isFailed(latest)) return false;
    } catch {
      // ignore transient poll errors
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
};

interface PaymentFormProps {
  paymentId: string;
  cart: ICartResponse;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentId, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [verifyPayment] = useVerifyPaymentMutation();
  const [createOrder] = useCreateOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDeliveryAddress>();

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.total ?? 0;

  const onSubmit: SubmitHandler<IDeliveryAddress> = async (data) => {
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const confirmResult = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?paymentId=${paymentId}`,
      },
      redirect: "if_required",
    });

    if (confirmResult.error) {
      setIsProcessing(false);
      navigate("/payment/failed", {
        state: { reason: confirmResult.error.message, paymentId },
      });
      return;
    }

    const poll = async (): Promise<unknown> => {
      try {
        return await verifyPayment({ paymentId }).unwrap();
      } catch {
        return { status: "unknown" };
      }
    };
    const isSucceeded = (d: unknown): boolean =>
      typeof d === "object" && d !== null && (d as { status?: string }).status === "succeeded";
    const isFailed = (d: unknown): boolean => {
      if (typeof d !== "object" || d === null) return false;
      const s = (d as { status?: string }).status;
      return s === "failed" || s === "canceled";
    };

    const settled = await waitForSucceeded(poll, isSucceeded, isFailed, {
      timeoutMs: 20000,
      intervalMs: 600,
    });

    if (!settled) {
      setIsProcessing(false);
      navigate("/payment/failed", {
        state: {
          reason:
            "We couldn't confirm your payment. Please review it in your order history.",
          paymentId,
        },
      });
      return;
    }

    try {
      const order = await createOrder({
        paymentId,
        deliveryAddress: {
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
        },
      }).unwrap();
      dispatch(clearCart());
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      const reason =
        (err as { data?: { message?: string } })?.data?.message ??
        "Payment successful, but we couldn't finalize your order. Please reach out.";
      setIsProcessing(false);
      navigate("/payment/success", {
        state: { paymentId, delivery: data, fallback: reason },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[1fr_420px]"
    >
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-gray-900">
            <FaLocationDot className="text-brand" /> Delivery Details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="label">
                Full name
              </label>
              <input
                id="fullName"
                className="input"
                placeholder="John Doe"
                {...register("fullName", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name is too short" },
                })}
              />
              {errors.fullName && (
                <p className="field-error">{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="label">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                className="input"
                placeholder="+1 234 567 890"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+0-9()\-\s]{7,}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="field-error">{errors.phone.message}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="address" className="label">
              Delivery address
            </label>
            <textarea
              id="address"
              rows={2}
              className="input resize-none"
              placeholder="123 Flavor Street, Food City"
              {...register("address", {
                required: "Delivery address is required",
              })}
            />
            {errors.address && (
              <p className="field-error">{errors.address.message}</p>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="city" className="label">
              City
            </label>
            <input
              id="city"
              className="input"
              placeholder="Food City"
              {...register("city")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-gray-900">
            <FaCreditCard className="text-brand" /> Payment
          </h2>
          <PaymentElement />
          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-gray-400">
            <FaLock size={10} /> Payments are encrypted and processed securely
            by Stripe.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-gray-900">
            Order Summary
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">
                Subtotal ({itemCount} items)
              </dt>
              <dd className="font-semibold">
                ${(cart.subtotal ?? 0).toFixed(2)}
              </dd>
            </div>
            {(cart.discount ?? 0) > 0 && (
              <div className="flex justify-between text-green-600">
                <dt className="flex items-center gap-1.5">
                  <FaPercent size={11} /> Item discount
                </dt>
                <dd className="font-semibold">
                  -${(cart.discount ?? 0).toFixed(2)}
                </dd>
              </div>
            )}
            {cart.couponCode && (cart.couponDiscount ?? 0) > 0 && (
              <div className="flex justify-between text-brand">
                <dt className="flex items-center gap-1.5">
                  <FaTag size={11} /> Coupon ({cart.couponCode})
                </dt>
                <dd className="font-semibold">
                  -${(cart.couponDiscount ?? 0).toFixed(2)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Delivery fee</dt>
              <dd
                className={`font-semibold ${
                  (cart.deliveryCharge ?? 0) === 0 ? "text-green-600" : ""
                }`}
              >
                {(cart.deliveryCharge ?? 0) === 0
                  ? "FREE"
                  : `$${(cart.deliveryCharge ?? 0).toFixed(2)}`}
              </dd>
            </div>
            <div className="my-2 border-t border-dashed border-gray-200" />
            <div className="flex justify-between text-base">
              <dt className="font-display font-bold text-gray-900">Total</dt>
              <dd className="text-lg font-extrabold text-brand">
                ${total.toFixed(2)}
              </dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="btn-primary mt-6 w-full disabled:opacity-60"
          >
            {isProcessing ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" /> Processing…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <FaLock size={12} /> Pay ${total.toFixed(2)}
              </span>
            )}
          </button>
          <Link
            to="/cart"
            className="mt-3 block text-center text-sm font-semibold text-gray-500 hover:text-brand"
          >
            Back to cart
          </Link>
        </div>
      </div>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const {
    data: cart,
    isFetching: isCartLoading,
    error: cartError,
  } = useGetCartQuery(void 0, { refetchOnMountOrArgChange: true });

  const [createIntent, { isLoading: isCreatingIntent }] =
    useCreatePaymentIntentMutation();
  const [intent, setIntent] = useState<IntentInfo | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);

  const startCheckout = useCallback(async (): Promise<void> => {
    setIntentError(null);
    try {
      const res = await createIntent().unwrap();
      if (res.clientSecret && res.payment) {
        setIntent({
          paymentId: res.payment._id,
          clientSecret: res.clientSecret,
        });
      } else {
        setIntentError("Could not initialize the payment. Please try again.");
      }
    } catch {
      setIntentError("Could not initialize the payment. Please try again.");
    }
  }, [createIntent]);

  useEffect(() => {
    if (cart && cart.items.length > 0 && !intent) {
      void startCheckout();
    }
  }, [cart, intent, startCheckout]);

  if (isCartLoading) {
    return (
      <section className="container-app py-16">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (cartError) {
    return (
      <section className="container-app py-16">
        <ErrorState
          title="Couldn't load your cart"
          message="Please try again in a moment."
          onRetry={() => window.location.reload()}
        />
      </section>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <section className="container-app py-16">
        <EmptyState
          icon={<FaShoppingCart />}
          title="Your cart is empty"
          message="Add some delicious meals before checking out."
          action={
            <Link to="/menu" className="btn-primary">
              Browse menu
            </Link>
          }
        />
      </section>
    );
  }

  if (!stripePromise) {
    return (
      <section className="container-app py-16">
        <ErrorState
          title="Stripe is not configured"
          message="The publishable key is missing from the environment. Please contact support."
        />
      </section>
    );
  }

  if (intentError) {
    return (
      <section className="container-app py-16">
        <ErrorState
          title="Checkout unavailable"
          message={intentError}
          onRetry={() => void startCheckout()}
        />
      </section>
    );
  }

  if (!intent) {
    return (
      <section className="container-app py-16">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="container-app py-10">
      <div className="mb-8">
        <Link
          to="/cart"
          className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand"
        >
          <FaArrowLeft size={12} /> Back to cart
        </Link>
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete your delivery details and pay securely.
        </p>
      </div>

      <Elements
        key={intent.paymentId}
        stripe={stripePromise}
        options={{
          clientSecret: intent.clientSecret,
          appearance: {
            theme: "stripe",
            variables: { colorPrimary: "#CC470A" },
          },
        }}
      >
        <PaymentForm paymentId={intent.paymentId} cart={cart} />
      </Elements>
      {isCreatingIntent && (
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Spinner size="sm" /> Preparing secure payment…
        </p>
      )}
    </section>
  );
};

export default CheckoutPage;
