import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  action,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white/60 px-6 py-16 text-center">
    {icon && <div className="text-5xl text-gray-300">{icon}</div>}
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    {message && <p className="max-w-md text-sm text-gray-500">{message}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
