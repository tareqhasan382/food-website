import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetFoodsQuery } from "../../redux/api/foodApi";
import { useCategories } from "../../hooks/useCategories";
import SectionHeading from "../ui/SectionHeading";
import FoodGrid from "./FoodGrid";
import FoodGridSkeleton from "./FoodGridSkeleton";
import ErrorState from "../ui/ErrorState";

const TopRatedSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const { categories } = useCategories();

  const args = useMemo(
    () => ({
      popular: true,
      sortBy: "rating" as const,
      sortOrder: "desc" as const,
      limit: 8,
      category: activeCategory || undefined,
    }),
    [activeCategory]
  );

  const { data, isFetching, isError, refetch } = useGetFoodsQuery(args);
  const foods = data?.foods ?? [];

  return (
    <section className="container-app py-12">
      <SectionHeading
        eyebrow="Handpicked for you"
        title="Top Rated Menu Items"
        subtitle="Our customers' all-time favourites, prepared fresh every day."
      />

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setActiveCategory("")}
          className={`btn !py-1.5 text-sm ${
            activeCategory === ""
              ? "btn-primary"
              : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => setActiveCategory(category.slug)}
            className={`btn !py-1.5 text-sm capitalize ${
              activeCategory === category.slug
                ? "btn-primary"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {isFetching && foods.length === 0 ? (
        <FoodGridSkeleton />
      ) : isError ? (
        <ErrorState
          title="Couldn't load top rated items"
          message="We hit a snag while fetching favourites. Please try again."
          onRetry={refetch}
        />
      ) : (
        <FoodGrid foods={foods} />
      )}

      <div className="mt-10 text-center">
        <Link to="/menu" className="btn-outline">
          View full menu
        </Link>
      </div>
    </section>
  );
};

export default TopRatedSection;
