import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaShoppingBag,
  FaTruck,
} from "react-icons/fa";
import {
  FaCreditCard,
  FaLocationDot,
  FaPercent,
  FaTag,
  FaXmark,
} from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  useCancelOrderMutation,
  useGetOrderByIdQuery,
} from "../redux/api/orderApi";
import { useGetPaymentByIdQuery } from "../redux/api/paymentApi";
import type { IOrderItem } from "../types/order";
import {
  isCancellable,
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABELS,
} from "../utils/order-status";
import OrderStatusTimeline from "../components/order/OrderStatusTimeline";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import { foodImage } from "../utils/food-image";

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderByIdQuery(orderId ?? "", { skip: !orderId });

  const { data: payment } = useGetPaymentByIdQuery(order?.paymentId ?? "", {
    skip: !order?.paymentId,
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

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

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const cancellable = isCancellable(order.status);

  const handleCancel = async (): Promise<void> => {
    try {
      await cancelOrder({ orderId: order._id }).unwrap();
      toast.success("Order cancelled successfully.");
      setConfirmCancel(false);
      void refetch();
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Could not cancel the order."
      );
    }
  };

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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-mono text-lg font-bold text-gray-900">
                  {order.orderNumber}
                </h1>
                <span
                  className={`badge capitalize ${ORDER_STATUS_BADGE[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Placed{" "}
                {new Date(order.createdAt ?? Date.now()).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/orders/${order._id}/track`}
                className="btn-primary"
              >
                <FaTruck size={13} /> Track order
              </Link>
              {cancellable && !confirmCancel && (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="btn bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                >
                  <FaXmark size={13} /> Cancel order
                </button>
              )}
            </div>
          </div>

          {cancellable && confirmCancel && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                Cancel this order?
              </p>
              <p className="mt-1 text-sm text-red-600/80">
                This action cannot be undone.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => void handleCancel()}
                  disabled={isCancelling}
                  className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {isCancelling ? <Spinner size="sm" /> : "Yes, cancel order"}
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  disabled={isCancelling}
                  className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand disabled:opacity-60"
                >
                  Keep order
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card mb-6 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
            <FaShoppingBag className="text-brand" /> Items
            <span className="text-sm font-normal text-gray-400">
              ({itemCount})
            </span>
          </h2>
          <ul className="space-y-3">
            {order.items.map((item: IOrderItem) => {
              const itemPrice = Number(item.price ?? 0);
              const discountPrice = Number(
                item.discountPrice ?? Number.POSITIVE_INFINITY
              );
              const hasDiscount =
                item.discountPrice !== undefined && discountPrice < itemPrice;
              const effectivePrice = hasDiscount ? discountPrice : itemPrice;
              return (
                <li key={item.foodId} className="flex items-center gap-3">
                  <img
                    src={foodImage({ images: [item.image ?? ""] })}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ${effectivePrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    ${item.lineTotal.toFixed(2)}
                  </p>
                </li>
              );
            })}
          </ul>
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
                {payment.paymentMethod && (
                  <p className="capitalize">{payment.paymentMethod}</p>
                )}
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

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-semibold">
                  ${(order.subtotal ?? 0).toFixed(2)}
                </dd>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt className="flex items-center gap-1.5">
                    <FaPercent size={11} /> Item discount
                  </dt>
                  <dd className="font-semibold">
                    -${(order.discount ?? 0).toFixed(2)}
                  </dd>
                </div>
              )}
              {order.couponCode && (order.couponDiscount ?? 0) > 0 && (
                <div className="flex justify-between text-brand">
                  <dt className="flex items-center gap-1.5">
                    <FaTag size={11} /> Coupon ({order.couponCode})
                  </dt>
                  <dd className="font-semibold">
                    -${(order.couponDiscount ?? 0).toFixed(2)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Delivery fee</dt>
                <dd className="font-semibold">
                  {(order.deliveryCharge ?? 0) === 0
                    ? "FREE"
                    : `$${(order.deliveryCharge ?? 0).toFixed(2)}`}
                </dd>
              </div>
              <div className="my-2 border-t border-dashed border-gray-200" />
              <div className="flex justify-between text-base">
                <dt className="font-display font-bold text-gray-900">Total</dt>
                <dd className="text-lg font-extrabold text-brand">
                  ${(order.total ?? 0).toFixed(2)}
                </dd>
              </div>
            </dl>
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
      </div>
    </section>
  );
};

export default OrderDetailsPage;
