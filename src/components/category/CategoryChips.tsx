import { useMemo } from "react";
import { useCategories } from "../../hooks/useCategories";

interface CategoryChipsProps {
  activeCategory?: string;
  onSelectCategory: (category: string) => void;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { categories } = useCategories();

  const chips = useMemo(
    () => [
      { slug: "", label: "All" },
      ...categories.map((category) => ({
        slug: category.slug,
        label: category.name,
      })),
    ],
    [categories]
  );

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ slug, label }) => (
        <button
          key={slug}
          onClick={() => onSelectCategory(slug)}
          className={`btn !py-1.5 text-sm capitalize transition-all duration-200 ${
            activeCategory === slug
              ? "btn-primary shadow-md shadow-brand-500/20"
              : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand-300 hover:text-brand"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;
