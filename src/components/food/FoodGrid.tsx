import { memo } from "react";
import { FaUtensils } from "react-icons/fa";
import FoodCard from "./FoodCard";
import EmptyState from "../ui/EmptyState";
import type { IFood } from "../../types/food";

interface FoodGridProps {
  foods: IFood[];
}

const FoodGrid: React.FC<FoodGridProps> = memo(({ foods }) => {
  if (foods.length === 0) {
    return (
      <EmptyState
        icon={<FaUtensils />}
        title="No foods found"
        message="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {foods.map((food) => (
        <FoodCard key={food._id} food={food} />
      ))}
    </div>
  );
});

export default FoodGrid;
