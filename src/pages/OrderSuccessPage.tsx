import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import {
  FaCreditCard,
  FaLocationDot,
  FaPercent,
  FaTag,
} from "react-icons/fa6";
import { useGetOrderByIdQuery } from "../redux/api/orderApi";
import { useGetPaymentByIdQuery } from "../redux/api/paymentApi";
import type { IOrderItem } from "../types/order";
import {
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABELS,
} from "../utils/order-status";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import { foodImage } from "../utils/food-image";

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId ?? "", { skip: !orderId });

  const { data: payment } = useGetPaymentByIdQuery(order?.paymentId ?? "", {
    skip: !order?.paymentId,
  });

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

  return (
    <section className="container-app py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/menu"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand"
        >
          <FaArrowLeft size={12} /> Continue shopping
        </Link>

        <div className="card overflow-hidden">
          <div className="flex flex-col items-center gap-3 bg-green-50 px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              <FaCheckCircle />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              Order Placed!
            </h1>
            <p className="max-w-md text-sm text-gray-600">
              Payment received and your order is confirmed. A confirmation
              email is on its way.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="badge bg-green-600 text-white">
                {order.orderNumber}
              </span>
              <span className={`badge capitalize ${ORDER_STATUS_BADGE[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="px-6 py-5">
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
                    item.discountPrice !== undefined &&
                    discountPrice < itemPrice;
                  const effectivePrice = hasDiscount
                    ? discountPrice
                    : itemPrice;
                  return (
                    <li
                      key={item.foodId}
                      className="flex items-center gap-3"
                    >
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

            <div className="grid gap-6 px-6 py-5 sm:grid-cols-2">
              {order.deliveryAddress && (
                <div>
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

              {payment && (
                <div>
                  <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                    <FaCreditCard className="text-brand" /> Payment
                  </h2>
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
                </div>
              )}
            </div>

            <div className="px-6 py-5">
              <dl className="mx-auto max-w-md space-y-2 text-sm">
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
                  <dt className="font-display font-bold text-gray-900">
                    Total
                  </dt>
                  <dd className="text-lg font-extrabold text-brand">
                    ${(order.total ?? 0).toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to={`/orders/${order._id}/track`} className="btn-primary">
            Track order
          </Link>
          <Link to="/menu" className="btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccessPage;
