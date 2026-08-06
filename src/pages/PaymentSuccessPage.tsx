import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import { FaHourglassHalf } from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  useGetPaymentByIdQuery,
  useVerifyPaymentMutation,
} from "../redux/api/paymentApi";
import { useCreateOrderMutation } from "../redux/api/orderApi";
import type { IDeliveryAddress } from "../types/order";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";

interface SuccessLocationState {
  paymentId?: string;
  delivery?: IDeliveryAddress;
}

const formatAmount = (amount: number, currency: string): string =>
  `${((amount ?? 0) / 100).toFixed(2)} ${(currency ?? "USD").toUpperCase()}`;

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as SuccessLocationState;
  const paymentId = searchParams.get("paymentId") ?? state.paymentId ?? "";

  const { data: payment, isFetching, refetch } = useGetPaymentByIdQuery(
    paymentId,
    { skip: !paymentId }
  );
  const [verifyPayment] = useVerifyPaymentMutation();
  const [createOrder, { isLoading: isPlacingOrder }] =
    useCreateOrderMutation();
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    if (hasVerified) return;
    if (!paymentId) return;
    if (payment && payment.status === "succeeded") return;
    setHasVerified(true);
    void verifyPayment({ paymentId }).catch(() => {
      // Refresh the payment state; if still unsynced the user can retry.
    });
  }, [payment, paymentId, verifyPayment, hasVerified]);

  const handleCompleteOrder = async (): Promise<void> => {
    try {
      const order = await createOrder({
        paymentId,
        deliveryAddress: state.delivery,
      }).unwrap();
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Could not place your order. Please try again."
      );
    }
  };

  if (!paymentId) {
    return (
      <section className="container-app py-16">
        <ErrorState
          title="Missing payment reference"
          message="We couldn't find the payment for this page."
        />
      </section>
    );
  }

  if (isFetching) {
    return (
      <section className="container-app py-16">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (!payment) {
    return (
      <section className="container-app py-16">
        <ErrorState
          title="Payment not found"
          message="We couldn't load this payment. Please contact support."
        />
      </section>
    );
  }

  if (payment.status === "failed" || payment.status === "canceled") {
    return (
      <section className="container-app py-16">
        <ErrorState
          title="Payment not completed"
          message={
            payment.failureReason ??
            "Your payment could not be completed. No money was charged."
          }
          onRetry={() => navigate("/checkout")}
        />
      </section>
    );
  }

  if (payment.status !== "succeeded") {
    return (
      <section className="container-app py-16">
        <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-600">
          <FaHourglassHalf />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Payment processing
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your payment is being processed. Check back in a moment.
        </p>
        <button
          onClick={() => void refetch()}
          className="btn-outline mt-6"
        >
          Refresh status
        </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-app py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          <FaCheckCircle />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Payment Successful
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Thank you! Your payment has been received.
        </p>

        <div className="card mt-6 space-y-3 p-6 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold text-gray-900">
              {formatAmount(payment.amount, payment.currency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction</span>
            <span className="max-w-[220px] truncate font-mono text-xs text-gray-900">
              {payment.transactionId}
            </span>
          </div>
          {payment.paymentMethod && (
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-semibold text-gray-900">
                {payment.paymentMethod}
              </span>
            </div>
          )}
          {payment.paidAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Paid at</span>
              <span className="font-semibold text-gray-900">
                {new Date(payment.paidAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {state.delivery ? (
            <button
              onClick={() => void handleCompleteOrder()}
              disabled={isPlacingOrder}
              className="btn-primary disabled:opacity-60"
            >
              {isPlacingOrder ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size="sm" /> Placing order…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <FaShoppingBag size={13} /> Complete my order
                </span>
              )}
            </button>
          ) : (
            <Link to="/menu" className="btn-primary">
              Continue shopping
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessPage;
