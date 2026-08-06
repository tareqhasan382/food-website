import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 16,
  className,
  showValue = false,
}) => {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;
  const active = hovered || Math.round(value);

  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onMouseEnter={interactive ? () => setHovered(star) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          onClick={interactive ? () => onChange?.(star) : undefined}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={
            interactive
              ? "cursor-pointer transition-transform hover:scale-125 focus:outline-none"
              : "cursor-default"
          }
        >
          {star <= active ? (
            <FaStar size={size} className="text-amber-400" />
          ) : (
            <FaRegStar size={size} className="text-gray-300" />
          )}
        </button>
      ))}
      {showValue && (
        <span className="ml-1.5 text-sm font-semibold text-gray-700">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
