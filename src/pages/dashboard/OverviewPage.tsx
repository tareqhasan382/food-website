import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaCartPlus,
  FaClipboardList,
  FaDollarSign,
  FaTags,
} from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import { orders } from "../../data/data";
import type { IOrder } from "../../types/food";

const statusStyles: Record<IOrder["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  preparing: "bg-blue-100 text-blue-700",
  "out-for-delivery": "bg-violet-100 text-violet-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const OverviewPage: React.FC = () => {
  const foods = useAppSelector((state) => state.food);
  const cartItems = useAppSelector((state) => state.cart.items);

  const stats = useMemo(
    () => [
      {
        label: "Menu items",
        value: foods.length,
        icon: FaBoxOpen,
        bg: "bg-brand-500",
      },
      {
        label: "Categories",
        value: new Set(foods.map((f) => f.category)).size,
        icon: FaTags,
        bg: "bg-blue-500",
      },
      {
        label: "Active orders",
        value: orders.filter(
          (o) => o.status !== "delivered" && o.status !== "cancelled"
        ).length,
        icon: FaClipboardList,
        bg: "bg-emerald-500",
      },
      {
        label: "Live cart items",
        value: cartItems.reduce((s, i) => s + i.quantity, 0),
        icon: FaCartPlus,
        bg: "bg-amber-500",
      },
    ],
    [foods, cartItems]
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900">
          Overview
        </h2>
        <p className="text-sm text-gray-500">
          A quick snapshot of your restaurant's activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <FaDollarSign className="text-green-500" />
            Live demo data
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-700">
                    {order.id}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{order.customer}</td>
                  <td className="px-5 py-3 text-gray-600">{order.items}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge ${statusStyles[order.status]}`}>
                      {order.status.replace("-", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/foods/new" className="btn-primary">
          <FaCartPlus size={14} /> Add food item
        </Link>
        <Link to="/dashboard/foods" className="btn-outline">
          Manage foods
        </Link>
      </div>
    </div>
  );
};

export default OverviewPage;
