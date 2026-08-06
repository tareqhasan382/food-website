import type { ReactNode } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

interface ErrorStateProps {
  icon?: ReactNode;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  icon,
  title = "Something went wrong",
  message = "We couldn't load this right now. Please try again.",
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-red-200 bg-red-50/60 px-6 py-16 text-center">
    <div className="text-5xl text-red-300">
      {icon ?? <FaExclamationTriangle />}
    </div>
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    {message && <p className="max-w-md text-sm text-gray-500">{message}</p>}
    {onRetry && (
      <button onClick={onRetry} className="btn-primary mt-2">
        <FaRedo size={13} /> Try again
      </button>
    )}
  </div>
);

export default ErrorState;
