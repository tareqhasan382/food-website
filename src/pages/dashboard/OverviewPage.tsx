import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaCartPlus,
  FaChartLine,
  FaClipboardList,
  FaClock,
  FaDollarSign,
  FaTags,
  FaUsers,
} from "react-icons/fa";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import {
  useGetDashboardOverviewQuery,
} from "../../redux/api/adminApi";
import { useGetAdminOrdersQuery } from "../../redux/api/orderApi";
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABELS } from "../../utils/order-status";
import { formatCurrency } from "../../components/charts/chart-utils";

const STATUS_STYLES = ORDER_STATUS_BADGE;

const formatDate = (value?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const OverviewPage: React.FC = () => {
  const {
    data: overview,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardOverviewQuery();
  const { data: recentOrders } = useGetAdminOrdersQuery({
    page: 1,
    limit: 6,
  });

  const orders = recentOrders?.orders ?? [];

  const stats = [
    {
      label: "Total revenue",
      value: overview ? formatCurrency(overview.totalRevenue) : "—",
      icon: FaDollarSign,
      bg: "bg-brand-500",
    },
    {
      label: "Total orders",
      value: overview?.totalOrders ?? 0,
      icon: FaClipboardList,
      bg: "bg-blue-500",
    },
    {
      label: "Total users",
      value: overview?.totalUsers ?? 0,
      icon: FaUsers,
      bg: "bg-emerald-500",
    },
    {
      label: "Pending orders",
      value: overview?.pendingOrders ?? 0,
      icon: FaClock,
      bg: "bg-amber-500",
    },
    {
      label: "Today's revenue",
      value: overview ? formatCurrency(overview.todayRevenue) : "—",
      icon: FaChartLine,
      bg: "bg-violet-500",
    },
    {
      label: "Today's orders",
      value: overview?.todayOrders ?? 0,
      icon: FaCartPlus,
      bg: "bg-rose-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load the dashboard"
        message="Make sure you are signed in as an administrator and try again."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            A live snapshot of your restaurant's performance.
          </p>
        </div>
        <Link to="/dashboard/analytics" className="btn-outline">
          <FaChartLine size={14} /> View analytics
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4 p-5">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg} text-lg text-white`}
            >
              <stat.icon />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="font-display text-lg font-bold text-gray-900">
            Recent orders
          </h3>
          <Link
            to="/dashboard/orders"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Placed</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-400"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-700">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {order.deliveryAddress?.fullName || "Customer"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`badge ${STATUS_STYLES[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/foods/new" className="btn-primary">
          <FaBoxOpen size={14} /> Add food item
        </Link>
        <Link to="/dashboard/coupons" className="btn-outline">
          <FaTags size={14} /> Manage coupons
        </Link>
        <Link to="/dashboard/users" className="btn-outline">
          <FaUsers size={14} /> Manage users
        </Link>
      </div>
    </div>
  );
};

export default OverviewPage;
