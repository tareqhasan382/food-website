import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { useGetPaymentByIdQuery } from "../redux/api/paymentApi";
import Spinner from "../components/ui/Spinner";

interface FailedLocationState {
  reason?: string;
  paymentId?: string;
}

const PaymentFailedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as FailedLocationState;

  const { data: payment, isFetching } = useGetPaymentByIdQuery(
    state.paymentId ?? "",
    { skip: !state.paymentId }
  );

  const reason =
    state.reason ??
    payment?.failureReason ??
    "Your payment could not be completed. No money has been charged.";

  return (
    <section className="container-app py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
          <FaXmark />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Payment Failed
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          We couldn't process your payment. No money has been charged.
        </p>

        <div className="card mt-6 p-5">
          {isFetching ? (
            <div className="flex justify-center py-4">
              <Spinner size="md" />
            </div>
          ) : (
            <p className="text-sm text-gray-600">{reason}</p>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={() => navigate("/checkout")} className="btn-primary">
            Try again
          </button>
          <Link to="/menu" className="btn-outline">
            Continue shopping
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Your cart is still saved. You can retry checkout whenever you're
          ready.
        </p>
      </div>
    </section>
  );
};

export default PaymentFailedPage;
