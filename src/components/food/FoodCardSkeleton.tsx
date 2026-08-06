import { memo } from "react";

const FoodCardSkeleton: React.FC = memo(() => (
  <div className="card overflow-hidden">
    <div className="h-44 animate-pulse bg-gray-200" />
    <div className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200" />
      <div className="flex items-center justify-between pt-1">
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-20 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  </div>
));

export default FoodCardSkeleton;
