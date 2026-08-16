import { useState } from "react";
import LineChart from "../../components/charts/LineChart";
import BarChart from "../../components/charts/BarChart";
import ChartCard from "../../components/charts/ChartCard";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import {
  useGetBestSellingFoodsQuery,
  useGetOrdersChartQuery,
  useGetRevenueChartQuery,
  useGetUsersChartQuery,
} from "../../redux/api/adminApi";
import {
  formatCompactCurrency,
  formatCurrency,
} from "../../components/charts/chart-utils";
import { foodImage } from "../../utils/food-image";
import {FaStore} from "react-icons/fa";

const RANGES = [7, 30, 90, 365];

const chartLoader = (
  <div className="flex h-64 items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const AnalyticsPage: React.FC = () => {
  const [days, setDays] = useState(30);

  const {
    data: revenue,
    isFetching: revenueLoading,
    isError: revenueError,
  } = useGetRevenueChartQuery(days);
  const {
    data: orders,
    isFetching: ordersLoading,
    isError: ordersError,
  } = useGetOrdersChartQuery(days);
  const {
    data: users,
    isFetching: usersLoading,
    isError: usersError,
  } = useGetUsersChartQuery(days);
  const {
    data: topFoods,
    isFetching: foodsLoading,
    isError: foodsError,
  } = useGetBestSellingFoodsQuery(10);

  const totalRevenue = (revenue ?? []).reduce((sum, p) => sum + p.revenue, 0);
  const totalOrders = (orders ?? []).reduce((sum, p) => sum + p.orders, 0);
  const totalUsers = (users ?? []).reduce((sum, p) => sum + p.users, 0);
  const maxQuantity = Math.max(1, ...(topFoods ?? []).map((f) => f.quantity));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Analytics
          </h2>
          <p className="text-sm text-gray-500">
            Revenue, orders, user growth and top-selling items.
          </p>
        </div>
        <div className="flex flex-wrap rounded-full bg-gray-100 p-1">
          {RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setDays(range)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 ${
                days === range
                  ? "bg-white text-brand shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {range} days
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex min-w-0 items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-500">Revenue (last {days}d)</p>
            <p className="truncate font-display text-xl font-bold text-gray-900 sm:text-2xl">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
            $
          </span>
        </div>
        <div className="card flex min-w-0 items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-500">Orders (last {days}d)</p>
            <p className="truncate font-display text-xl font-bold text-gray-900 sm:text-2xl">
              {totalOrders}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            #
          </span>
        </div>
        <div className="card flex min-w-0 items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-500">New users (last {days}d)</p>
            <p className="truncate font-display text-xl font-bold text-gray-900 sm:text-2xl">
              {totalUsers}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            +
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Revenue"
          subtitle="Paid order revenue per day"
          right={
            <span className="badge bg-brand-50 text-brand">
              {formatCompactCurrency(totalRevenue)}
            </span>
          }
        >
          {revenueError ? (
            <ErrorState title="Could not load revenue data" />
          ) : revenueLoading ? (
            chartLoader
          ) : (
            <LineChart
              data={(revenue ?? []).map((p) => ({
                label: p.date,
                value: p.revenue,
              }))}
              formatValue={formatCompactCurrency}
            />
          )}
        </ChartCard>

        <ChartCard
          title="Orders"
          subtitle="Orders placed per day"
          right={
            <span className="badge bg-blue-50 text-blue-600">{totalOrders}</span>
          }
        >
          {ordersError ? (
            <ErrorState title="Could not load orders data" />
          ) : ordersLoading ? (
            chartLoader
          ) : (
            <BarChart
              data={(orders ?? []).map((p) => ({
                label: p.date,
                value: p.orders,
              }))}
              color="#3B82F6"
            />
          )}
        </ChartCard>

        <ChartCard
          title="Users"
          subtitle="New signups per day"
          right={
            <span className="badge bg-emerald-50 text-emerald-600">
              {totalUsers}
            </span>
          }
        >
          {usersError ? (
            <ErrorState title="Could not load user data" />
          ) : usersLoading ? (
            chartLoader
          ) : (
            <LineChart
              data={(users ?? []).map((p) => ({
                label: p.date,
                value: p.users,
              }))}
              color="#10B981"
            />
          )}
        </ChartCard>

        <ChartCard title="Top foods" subtitle="Best sellers by units sold">
          {foodsError ? (
            <ErrorState title="Could not load top foods data" />
          ) : foodsLoading ? (
            chartLoader
          ) : (topFoods ?? []).length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
              No sales yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {(topFoods ?? []).map((food, index) => (
                <li key={food.foodId} className="flex items-center gap-3">
                  <span className="w-5 shrink-0 text-sm font-bold text-gray-400">
                    {index + 1}
                  </span>
                  {food.image? <img
                      src={foodImage({ images: food.image ? [food.image] : [] })}
                      alt={food.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                  />:<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-lg text-white">
              <FaStore />
            </span>}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-gray-800">
                        {food.name}
                      </span>
                      <span className="shrink-0 text-xs text-gray-500">
                        {food.quantity} sold ·{" "}
                        {formatCompactCurrency(food.revenue)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{
                          width: `${(food.quantity / maxQuantity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;
