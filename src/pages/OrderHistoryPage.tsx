import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaClipboardList, FaTruck } from "react-icons/fa";
import { useGetOrderHistoryQuery } from "../redux/api/orderApi";
import type { OrderStatus } from "../types/order";
import {
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABELS,
} from "../utils/order-status";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Spinner from "../components/ui/Spinner";

const PAGE_SIZE = 10;

interface StatusFilter {
  value: OrderStatus | "all";
  label: string;
}

const FILTERS: StatusFilter[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderHistoryPage: React.FC = () => {
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);

  const {
    data,
    isFetching,
    error,
    refetch,
  } = useGetOrderHistoryQuery({
    page,
    limit: PAGE_SIZE,
    status: status === "all" ? undefined : status,
  });

  const orders = data?.orders ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleFilter = (value: OrderStatus | "all"): void => {
    setStatus(value);
    setPage(1);
  };

  return (
    <section className="container-app py-10">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900">
          <FaClipboardList className="text-brand" /> Your Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review past orders and track delivery progress.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = status === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => handleFilter(filter.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-brand text-white shadow-sm shadow-brand/30"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {isFetching && orders.length === 0 && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {!!error && !isFetching && (
        <ErrorState
          title="Couldn't load your orders"
          message="Please try again in a moment."
          onRetry={() => void refetch()}
        />
      )}

      {!isFetching && !error && orders.length === 0 && (
        <EmptyState
          icon={<FaClipboardList />}
          title={
            status === "all" ? "No orders yet" : "No orders in this status"
          }
          message={
            status === "all"
              ? "When you place an order it will show up here."
              : `You don't have any "${ORDER_STATUS_LABELS[status as OrderStatus]}" orders.`
          }
          action={
            status === "all" ? (
              <Link to="/menu" className="btn-primary">
                Browse menu
              </Link>
            ) : undefined
          }
        />
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            const firstItem = order.items[0];
            const extraCount = order.items.length - 1;
            return (
              <div
                key={order._id}
                className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/orders/${order._id}`}
                      className="font-mono text-sm font-bold text-brand hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                    <span
                      className={`badge capitalize ${ORDER_STATUS_BADGE[order.status]}`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(order.createdAt ?? Date.now()).toLocaleString()}
                  </p>
                  {firstItem && (
                    <p className="mt-1 truncate text-sm text-gray-600">
                      {firstItem.name}
                      {extraCount > 0
                        ? ` + ${extraCount} more`
                        : itemCount > 1
                          ? ` (${itemCount} items)`
                          : ""}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <p className="text-lg font-extrabold text-gray-900">
                    ${(order.total ?? 0).toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/orders/${order._id}/track`}
                      className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand"
                    >
                      <FaTruck size={12} /> Track
                    </Link>
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn-primary"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
            className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand disabled:opacity-40"
          >
            <FaChevronLeft size={12} /> Prev
          </button>
          <span className="text-sm font-semibold text-gray-600">
            Page {page} of {totalPages}
            {meta?.total !== undefined && ` · ${meta.total} total`}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isFetching}
            className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand disabled:opacity-40"
          >
            Next <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </section>
  );
};

export default OrderHistoryPage;
