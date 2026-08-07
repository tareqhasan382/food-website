import { Fragment, useMemo, useState } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaSearch,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Select from "../../components/ui/Select";
import {
  useGetAdminOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
} from "../../redux/api/orderApi";
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABELS } from "../../utils/order-status";
import { formatCurrency } from "../../components/charts/chart-utils";
import type { OrderStatus } from "../../types/order";
import type { AdminOrder } from "../../types/admin";

const PAGE_SIZE = 10;

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};

const formatDate = (value?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const OrdersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const args = useMemo(
    () => ({
      searchTerm: search.trim() || undefined,
      status: status || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [search, status, page]
  );

  const { data, isFetching, isLoading, refetch } = useGetAdminOrdersQuery(args, {
    refetchOnMountOrArgChange: true,
  });
  const { data: stats } = useGetOrderStatsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const orders = data?.orders ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const statusCounts = stats?.statusCounts;

  const handleStatusChange = async (
    order: AdminOrder,
    next: OrderStatus
  ): Promise<void> => {
    try {
      await updateStatus({ orderId: order._id, status: next }).unwrap();
      toast.success(
        `${order.orderNumber} moved to ${ORDER_STATUS_LABELS[next]}`
      );
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to update status";
      toast.error(msg);
    }
  };

  const statusCards: { key: OrderStatus }[] = (
    ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"] as OrderStatus[]
  ).map((key) => ({ key }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Orders
          </h2>
          <p className="text-sm text-gray-500">
            {meta?.total ?? 0} orders in total
            {stats?.revenue !== undefined && (
              <> · {formatCurrency(stats.revenue)} earned</>
            )}
          </p>
        </div>
        <button
          onClick={() => void refetch()}
          disabled={isFetching}
          className="btn-ghost"
        >
          Refresh
        </button>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {statusCards.map(({ key }) => (
          <button
            key={key}
            onClick={() => {
              setStatus(key === status ? "" : key);
              setPage(1);
            }}
            className={`card p-3 text-left transition-colors ${
              status === key
                ? "ring-2 ring-brand"
                : "hover:ring-1 hover:ring-brand-200"
            }`}
            aria-label={`Filter by ${ORDER_STATUS_LABELS[key]}`}
          >
            <span className={`badge ${ORDER_STATUS_BADGE[key]} mb-2`}>
              {ORDER_STATUS_LABELS[key]}
            </span>
            <p className="font-display text-xl font-bold text-gray-900">
              {statusCounts?.[key] ?? 0}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order number…"
            className="input pl-9"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No orders found"
              message="Try a different search term or status filter."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Placed</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Update status</th>
                  <th className="px-5 py-3 text-right font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const transitions = ALLOWED_TRANSITIONS[order.status];
                  const expanded = expandedId === order._id;
                  return (
                    <Fragment key={order._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-semibold text-gray-700">
                          {order.orderNumber}
                        </td>
                        <td className="px-5 py-3 text-gray-600">
                          {order.deliveryAddress?.fullName || "Customer"}
                        </td>
                        <td className="px-5 py-3 text-gray-600">
                          {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-800">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-5 py-3 text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`badge ${ORDER_STATUS_BADGE[order.status]}`}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {transitions.length > 0 ? (
                            <Select
                              value={order.status}
                              onChange={(e) =>
                                void handleStatusChange(
                                  order,
                                  e.target.value as OrderStatus
                                )
                              }
                              disabled={isUpdating}
                              variant="sm"
                              className="!w-auto"
                              aria-label={`Update status for ${order.orderNumber}`}
                            >
                              <option value={order.status} disabled>
                                {ORDER_STATUS_LABELS[order.status]}
                              </option>
                              {transitions.map((t) => (
                                <option key={t} value={t}>
                                  {ORDER_STATUS_LABELS[t]}
                                </option>
                              ))}
                            </Select>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No updates
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() =>
                              setExpandedId(expanded ? null : order._id)
                            }
                            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
                            aria-expanded={expanded}
                          >
                            {expanded ? (
                              <FaChevronUp size={12} />
                            ) : (
                              <FaChevronDown size={12} />
                            )}
                            {expanded ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="bg-gray-50/60">
                          <td colSpan={8} className="px-5 py-4">
                            <OrderDetails order={order} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
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
    </div>
  );
};

const OrderDetails: React.FC<{ order: AdminOrder }> = ({ order }) => (
  <div className="grid gap-6 lg:grid-cols-2">
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
        Items
      </h4>
      <ul className="space-y-2">
        {order.items.map((item) => (
          <li
            key={item.foodId}
            className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-gray-100"
          >
            <span className="min-w-0 truncate font-medium text-gray-700">
              {item.quantity} × {item.name}
            </span>
            <span className="shrink-0 font-semibold text-gray-800">
              {formatCurrency(item.lineTotal)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-1 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-gray-100">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Delivery</span>
          <span>{formatCurrency(order.deliveryCharge)}</span>
        </div>
        {order.couponCode && (
          <div className="flex justify-between text-gray-500">
            <span>Coupon ({order.couponCode})</span>
            <span>-{formatCurrency(order.couponDiscount ?? 0)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>

    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
        Customer &amp; delivery
      </h4>
      <dl className="space-y-2 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-gray-100">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Name</dt>
          <dd className="font-medium text-gray-800">
            {order.deliveryAddress?.fullName || "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Phone</dt>
          <dd className="font-medium text-gray-800">
            {order.deliveryAddress?.phone || "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Address</dt>
          <dd className="text-right font-medium text-gray-800">
            {order.deliveryAddress?.address || "—"}
            {order.deliveryAddress?.city
              ? `, ${order.deliveryAddress.city}`
              : ""}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Payment</dt>
          <dd className="font-medium text-gray-800">
            {order.paymentId ? "Processed" : "—"}
          </dd>
        </div>
      </dl>
    </div>
  </div>
);

export default OrdersPage;
