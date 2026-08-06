import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaTruck } from "react-icons/fa";
import { FaCreditCard, FaLocationDot } from "react-icons/fa6";
import { useGetOrderByIdQuery } from "../redux/api/orderApi";
import { useGetPaymentByIdQuery } from "../redux/api/paymentApi";
import type { OrderStatus } from "../types/order";
import {
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STEPS,
  statusProgress,
} from "../utils/order-status";
import OrderStatusTimeline from "../components/order/OrderStatusTimeline";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";

const TrackOrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId ?? "", { skip: !orderId });

  const { data: payment } = useGetPaymentByIdQuery(order?.paymentId ?? "", {
    skip: !order?.paymentId,
  });

  const historyMap = useMemo(() => {
    const map: Partial<Record<OrderStatus, string>> = {};
    order?.statusHistory.forEach((entry) => {
      map[entry.status] = entry.changedAt;
    });
    return map;
  }, [order]);

  const progress = useMemo(() => {
    if (!order) return 0;
    if (order.status === "cancelled") {
      let max = 0;
      order.statusHistory.forEach((entry) => {
        if (entry.status !== "cancelled") {
          max = Math.max(max, statusProgress(entry.status));
        }
      });
      return max;
    }
    return statusProgress(order.status);
  }, [order]);

  if (isLoading) {
    return (
      <section className="container-app py-16">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="container-app py-16">
        <ErrorState
          title="Order not found"
          message="We couldn't find this order. It may belong to a different account."
        />
      </section>
    );
  }

  const isCancelled = order.status === "cancelled";

  return (
    <section className="container-app py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand"
        >
          <FaArrowLeft size={12} /> Back to orders
        </Link>

        <div className="card mb-6 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-gray-900">
                  <FaTruck className="text-brand" /> Track Order
                </h1>
                <span
                  className={`badge capitalize ${ORDER_STATUS_BADGE[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-mono font-semibold text-gray-900">
                  {order.orderNumber}
                </span>{" "}
                · Placed{" "}
                {new Date(order.createdAt ?? Date.now()).toLocaleString()}
              </p>
            </div>
            <Link to={`/orders/${order._id}`} className="btn-outline">
              Order details
            </Link>
          </div>
        </div>

        <div className="card mb-6 p-6">
          <div className="flex">
            {ORDER_STATUS_STEPS.map((step, index) => {
              const reached = index <= progress;
              const isCurrent = index === progress && !isCancelled;
              return (
                <div
                  key={step}
                  className="relative flex flex-1 flex-col items-center"
                >
                  {index > 0 && (
                    <span
                      aria-hidden
                      className={`absolute right-1/2 top-4 h-0.5 w-full ${
                        reached ? "bg-brand" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ring-2 ${
                      isCurrent
                        ? "bg-white text-brand ring-brand"
                        : reached
                          ? "bg-brand text-white ring-brand"
                          : "bg-gray-100 text-gray-400 ring-gray-200"
                    }`}
                  >
                    {isCurrent ? (
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand" />
                    ) : reached ? (
                      <FaCheck size={14} />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-gray-300" />
                    )}
                  </span>
                  <p
                    className={`mt-2 text-center text-xs font-semibold ${
                      reached ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {ORDER_STATUS_LABELS[step]}
                  </p>
                  <p className="mt-0.5 text-center text-[10px] text-gray-400">
                    {historyMap[step]
                      ? new Date(historyMap[step]!).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
              );
            })}
          </div>

          {isCancelled && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              This order was cancelled. No further status updates will be
              recorded.
            </div>
          )}
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          {order.deliveryAddress && (
            <div className="card p-6">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                <FaLocationDot className="text-brand" /> Delivery
              </h2>
              <div className="space-y-0.5 text-sm text-gray-600">
                {order.deliveryAddress.fullName && (
                  <p className="font-semibold text-gray-900">
                    {order.deliveryAddress.fullName}
                  </p>
                )}
                {order.deliveryAddress.address && (
                  <p>{order.deliveryAddress.address}</p>
                )}
                {order.deliveryAddress.city && (
                  <p>{order.deliveryAddress.city}</p>
                )}
                {order.deliveryAddress.phone && (
                  <p>{order.deliveryAddress.phone}</p>
                )}
              </div>
            </div>
          )}

          <div className="card p-6">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
              <FaCreditCard className="text-brand" /> Payment
            </h2>
            {payment ? (
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  Amount{" "}
                  <span className="font-semibold text-gray-900">
                    ${((payment.amount ?? 0) / 100).toFixed(2)}{" "}
                    {(payment.currency ?? "USD").toUpperCase()}
                  </span>
                </p>
                <p className="truncate font-mono text-xs text-gray-400">
                  {payment.transactionId}
                </p>
                {payment.paidAt && (
                  <p>{new Date(payment.paidAt).toLocaleString()}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Payment information is not available.
              </p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-gray-900">
            Status Timeline
          </h2>
          <OrderStatusTimeline
            history={order.statusHistory}
            currentStatus={order.status}
          />
        </div>
      </div>
    </section>
  );
};

export default TrackOrderPage;
