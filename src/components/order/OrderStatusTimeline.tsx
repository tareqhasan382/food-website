import { FaCheck, FaTimes } from "react-icons/fa";
import type {
  IOrderStatusHistory,
  OrderStatus,
} from "../../types/order";
import { ORDER_STATUS_LABELS } from "../../utils/order-status";

interface OrderStatusTimelineProps {
  history: IOrderStatusHistory[];
  currentStatus: OrderStatus;
}

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  history,
  currentStatus,
}) => {
  if (!history.length) {
    return (
      <p className="text-sm text-gray-500">
        No status updates recorded yet.
      </p>
    );
  }

  return (
    <ol className="space-y-0">
      {history.map((entry, index) => {
        const isLast = index === history.length - 1;
        const isCurrent = entry.status === currentStatus;
        const isCancelled = entry.status === "cancelled";

        return (
          <li key={`${entry.status}-${index}`} className="relative pb-8 pl-12 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[15px] top-9 h-full w-0.5 bg-gray-200"
              />
            )}
            <span
              className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-sm ring-2 ${
                isCancelled
                  ? "bg-red-100 text-red-600 ring-red-200"
                  : isCurrent
                    ? "bg-brand text-white ring-brand"
                    : "bg-green-100 text-green-600 ring-green-200"
              }`}
            >
              {isCancelled ? (
                <FaTimes size={14} />
              ) : isCurrent ? (
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
              ) : (
                <FaCheck size={14} />
              )}
            </span>
            <div className="pt-0.5">
              <p
                className={`text-sm font-bold ${
                  isCurrent ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {ORDER_STATUS_LABELS[entry.status]}
                {isCurrent && (
                  <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-brand">
                    Current
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(entry.changedAt).toLocaleString()}
              </p>
              {entry.note && (
                <p className="mt-1 text-sm text-gray-500">{entry.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderStatusTimeline;
