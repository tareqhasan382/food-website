import { memo } from "react";
import FoodCardSkeleton from "./FoodCardSkeleton";

interface FoodGridSkeletonProps {
  count?: number;
}

const FoodGridSkeleton: React.FC<FoodGridSkeletonProps> = memo(
  ({ count = 8 }) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <FoodCardSkeleton key={i} />
      ))}
    </div>
  )
);

export default FoodGridSkeleton;
