import { useMemo, useState } from "react";
import {
  FaChartLine,
  FaDollarSign,
  FaFileAlt,
  FaHashtag,
  FaLayerGroup,
  FaPercentage,
  FaShoppingBag,
  FaTag,
  FaTicketAlt,
} from "react-icons/fa";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";
import ChartCard from "../../components/charts/ChartCard";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import {
  useGetCategorySalesQuery,
  useGetCouponUsageQuery,
  useGetDailySalesQuery,
  useGetMonthlySalesQuery,
} from "../../redux/api/adminApi";
import { useGetOrderStatsQuery } from "../../redux/api/orderApi";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  shortDate,
} from "../../components/charts/chart-utils";
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABELS } from "../../utils/order-status";
import type { OrderStatus } from "../../types/order";

const MONTH_RANGES = [3, 6, 12, 24];
const DAY_RANGES = [7, 30, 90, 180];

const chartLoader = (
  <div className="flex h-64 items-center justify-center">
    <Spinner size="lg" />
  </div>
);

type SortKey = "date" | "revenue" | "orders" | "aov";
type SortDir = "asc" | "desc";

const ReportsPage: React.FC = () => {
  const [months, setMonths] = useState(12);
  const [days, setDays] = useState(30);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const {
    data: monthly,
    isFetching: monthlyLoading,
    isError: monthlyError,
  } = useGetMonthlySalesQuery(months);
  const {
    data: daily,
    isFetching: dailyLoading,
    isError: dailyError,
  } = useGetDailySalesQuery(days);
  const {
    data: categories,
    isFetching: catsLoading,
    isError: catsError,
  } = useGetCategorySalesQuery({ days, limit: 10 });
  const {
    data: coupons,
    isFetching: couponsLoading,
    isError: couponsError,
  } = useGetCouponUsageQuery({ days, limit: 10 });
  const { data: orderStats, isLoading: statsLoading } = useGetOrderStatsQuery();

  const kpis = useMemo(() => {
    const rows = daily ?? [];
    const totalRevenue = rows.reduce((sum, r) => sum + r.revenue, 0);
    const totalOrders = rows.reduce((sum, r) => sum + r.orders, 0);
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const couponDiscount = (coupons ?? []).reduce((s, c) => s + c.discount, 0);
    const couponUses = (coupons ?? []).reduce((s, c) => s + c.uses, 0);
    return {
      totalRevenue,
      totalOrders,
      aov,
      couponDiscount,
      couponUses,
    };
  }, [daily, coupons]);

  const totalMonthlyRevenue = (monthly ?? []).reduce(
    (s, m) => s + m.revenue,
    0
  );
  const totalMonthlyOrders = (monthly ?? []).reduce(
    (s, m) => s + m.orders,
    0
  );
  const maxCategoryRevenue = Math.max(
    1,
    ...(categories ?? []).map((c) => c.revenue)
  );
  const statusCounts = orderStats?.statusCounts ?? ({} as Record<OrderStatus, number>);
  const totalStatus = Object.values(statusCounts).reduce((s, n) => s + n, 0);
  const maxStatus = Math.max(1, ...Object.values(statusCounts));

  const dailyRows = useMemo(() => {
    const rows = (daily ?? []).map((r) => ({
      ...r,
      aov: r.orders > 0 ? r.revenue / r.orders : 0,
    }));
    const factor = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      switch (sortKey) {
        case "revenue":
          return (a.revenue - b.revenue) * factor;
        case "orders":
          return (a.orders - b.orders) * factor;
        case "aov":
          return (a.aov - b.aov) * factor;
        case "date":
        default:
          return a.date.localeCompare(b.date) * factor;
      }
    });
  }, [daily, sortKey, sortDir]);

  const toggleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortCaret = (key: SortKey): string => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Reports
          </h2>
          <p className="text-sm text-gray-500">
            In-depth performance reports, trend analysis and breakdowns.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Monthly trend
            </span>
            <div className="flex flex-wrap rounded-full bg-gray-100 p-1">
              {MONTH_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setMonths(range)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                    months === range
                      ? "bg-white text-brand shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {range} mo
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Detail window
            </span>
            <div className="flex flex-wrap rounded-full bg-gray-100 p-1">
              {DAY_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setDays(range)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                    days === range
                      ? "bg-white text-brand shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {range}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="card flex min-w-0 items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-500">Revenue ({days}d)</p>
            <p className="truncate font-display text-xl font-bold text-gray-900 sm:text-2xl">
              {formatCurrency(kpis.totalRevenue)}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
            <FaDollarSign />
          </span>
        </div>
        <div className="card flex min-w-0 items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-500">Orders ({days}d)</p>
            <p className="truncate font-display text-xl font-bold text-gray-900 sm:text-2xl">
              {formatCompactNumber(kpis.totalOrders)}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FaShoppingBag />
          </span>
        </div>
        <div className="card flex min-w-0 items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-500">Avg order value</p>
            <p className="truncate font-display text-xl font-bold text-gray-900 sm:text-2xl">
              {formatCurrency(kpis.aov)}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FaChartLine />
          </span>
        </div>
        <div className="card flex min-w-0 items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-500">Coupons used</p>
            <p className="truncate font-display text-xl font-bold text-gray-900 sm:text-2xl">
              {formatCompactNumber(kpis.couponUses)}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <FaTicketAlt />
          </span>
        </div>
        <div className="card flex min-w-0 items-center justify-between gap-4 p-5 sm:col-span-2 xl:col-span-1">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-500">Discount given</p>
            <p className="truncate font-display text-xl font-bold text-gray-900 sm:text-2xl">
              {formatCurrency(kpis.couponDiscount)}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <FaPercentage />
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Monthly revenue"
          subtitle={`Revenue across last ${months} months`}
          right={
            <span className="badge bg-brand-50 text-brand">
              {formatCompactCurrency(totalMonthlyRevenue)}
            </span>
          }
        >
          {monthlyError ? (
            <ErrorState title="Could not load monthly revenue" />
          ) : monthlyLoading ? (
            chartLoader
          ) : (
            <LineChart
              data={(monthly ?? []).map((p) => ({
                label: p.month,
                value: p.revenue,
              }))}
              formatValue={formatCompactCurrency}
            />
          )}
          <div className="mt-4 -mb-2">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Monthly orders
              </div>
              <span className="badge bg-blue-50 text-blue-600">
                {formatCompactNumber(totalMonthlyOrders)}
              </span>
            </div>
            {monthlyError ? (
              <ErrorState title="Could not load monthly orders" />
            ) : monthlyLoading ? (
              chartLoader
            ) : (
              <BarChart
              data={(monthly ?? []).map((p) => ({
                label: p.month,
                value: p.orders,
              }))}
              color="#3B82F6"
            />
            )}
          </div>
        </ChartCard>

        <ChartCard
          title={`Daily sales — last ${days} days`}
          subtitle="Revenue per day with order volume"
          right={
            <span className="badge bg-blue-50 text-blue-600">
              {formatCompactNumber(kpis.totalOrders)} orders
            </span>
          }
        >
          {dailyError ? (
            <ErrorState title="Could not load daily revenue" />
          ) : dailyLoading ? (
            chartLoader
          ) : (
            <LineChart
              data={(daily ?? []).map((p) => ({
                label: p.date,
                value: p.revenue,
              }))}
              formatValue={formatCompactCurrency}
            />
          )}
          <div className="mt-4 -mb-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Orders per day
            </div>
            {dailyError ? (
              <ErrorState title="Could not load daily orders" />
            ) : dailyLoading ? (
              chartLoader
            ) : (
              <BarChart
                data={(daily ?? []).map((p) => ({
                  label: p.date,
                  value: p.orders,
                }))}
                color="#10B981"
              />
            )}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Order status distribution"
          subtitle="All orders grouped by current status"
          right={
            <span className="badge bg-gray-100 text-gray-600">
              {formatCompactNumber(totalStatus)} total
            </span>
          }
        >
          {statsLoading ? (
            chartLoader
          ) : totalStatus === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
              No orders yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map(
                (status) => {
                  const count = statusCounts[status] ?? 0;
                  const pct = (count / totalStatus) * 100;
                  return (
                    <li key={status} className="flex items-center gap-3">
                      <span
                        className={`badge w-36 shrink-0 justify-start ${ORDER_STATUS_BADGE[status]}`}
                      >
                        {ORDER_STATUS_LABELS[status]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-baseline justify-between gap-2">
                          <span className="truncate text-xs text-gray-500">
                            {pct.toFixed(1)}%
                          </span>
                          <span className="shrink-0 text-sm font-semibold text-gray-800">
                            {formatCompactNumber(count)}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-brand"
                            style={{
                              width: `${(count / maxStatus) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          )}
        </ChartCard>

        <ChartCard
          title="Top categories"
          subtitle={`Revenue by category — last ${days} days`}
        >
          {catsError ? (
            <ErrorState title="Could not load category breakdown" />
          ) : catsLoading ? (
            chartLoader
          ) : (categories ?? []).length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
              No category data yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {(categories ?? []).map((cat, index) => (
                <li key={cat.category} className="flex items-center gap-3">
                  <span className="w-6 shrink-0 text-sm font-bold text-gray-400">
                    {index + 1}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
                    <FaLayerGroup size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-gray-800">
                        {cat.category}
                      </span>
                      <span className="shrink-0 text-xs text-gray-500">
                        {formatCompactNumber(cat.quantity)} sold ·{" "}
                        {formatCompactCurrency(cat.revenue)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{
                          width: `${(cat.revenue / maxCategoryRevenue) * 100}%`,
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

      <ChartCard
        title="Coupon usage"
        subtitle={`Redemption and discounts — last ${days} days`}
        right={
          <span className="badge bg-violet-50 text-violet-600">
            <FaTag size={11} className="mr-1 inline" />{" "}
            {formatCompactCurrency(kpis.couponDiscount)} saved
          </span>
        }
      >
        {couponsError ? (
          <ErrorState title="Could not load coupon report" />
        ) : couponsLoading ? (
          chartLoader
        ) : (coupons ?? []).length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
            No coupon usage in this window.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-semibold">Coupon</th>
                  <th className="px-4 py-3 font-semibold">Uses</th>
                  <th className="px-4 py-3 font-semibold">Subtotal</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Savings %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(coupons ?? []).map((c) => {
                  const savings =
                    c.subtotal > 0 ? (c.discount / c.subtotal) * 100 : 0;
                  return (
                    <tr key={c.code} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <code className="rounded-md bg-brand-50 px-2 py-0.5 font-mono text-sm font-semibold text-brand">
                          {c.code}
                        </code>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-700">
                        {formatCompactNumber(c.uses)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatCurrency(c.subtotal)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-rose-600">
                        -{formatCurrency(c.discount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-rose-50 text-rose-600">
                          {savings.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>

      <ChartCard
        title="Daily sales detail"
        subtitle="Click any header to sort the rows"
        right={
          <span className="badge bg-gray-100 text-gray-600">
            <FaFileAlt size={11} className="mr-1 inline" />{" "}
            <FaHashtag size={10} className="inline" />{" "}
            {dailyRows.length} rows
          </span>
        }
      >
        {dailyError ? (
          <ErrorState title="Could not load daily sales" />
        ) : dailyLoading ? (
          chartLoader
        ) : dailyRows.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
            No rows for the selected window.
          </div>
        ) : (
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 shadow-sm">
                <tr>
                  <th
                    onClick={() => toggleSort("date")}
                    className="cursor-pointer select-none px-4 py-3 font-semibold hover:text-gray-700"
                  >
                    Date{sortCaret("date")}
                  </th>
                  <th
                    onClick={() => toggleSort("revenue")}
                    className="cursor-pointer select-none px-4 py-3 text-right font-semibold hover:text-gray-700"
                  >
                    Revenue{sortCaret("revenue")}
                  </th>
                  <th
                    onClick={() => toggleSort("orders")}
                    className="cursor-pointer select-none px-4 py-3 text-right font-semibold hover:text-gray-700"
                  >
                    Orders{sortCaret("orders")}
                  </th>
                  <th
                    onClick={() => toggleSort("aov")}
                    className="cursor-pointer select-none px-4 py-3 text-right font-semibold hover:text-gray-700"
                  >
                    AOV{sortCaret("aov")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dailyRows.map((r) => (
                  <tr key={r.date} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium text-gray-700">
                      {shortDate(r.date)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                      {formatCurrency(r.revenue)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700">
                      {formatCompactNumber(r.orders)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-600">
                      {formatCurrency(r.aov)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </div>
  );
};

export default ReportsPage;
