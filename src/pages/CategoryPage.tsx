import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSpinner, FaUtensils } from "react-icons/fa";
import { useFoodFeed } from "../hooks/useFoodFeed";
import { useCategories } from "../hooks/useCategories";
import SectionHeading from "../components/ui/SectionHeading";
import FoodGrid from "../components/food/FoodGrid";
import FoodGridSkeleton from "../components/food/FoodGridSkeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import CategorySidebar from "../components/category/CategorySidebar";
import CategoryChips from "../components/category/CategoryChips";

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<string>(
    category ?? ""
  );

  const { categories } = useCategories();

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    }
  }, [category]);

  const feedOptions = useMemo(
    () => ({
      category: activeCategory || undefined,
      sortBy: "newest" as const,
      sortOrder: "desc" as const,
      pageSize: 12,
    }),
    [activeCategory]
  );

  const feed = useFoodFeed(feedOptions);

  const handleSelectCategory = (slug: string): void => {
    setActiveCategory(slug);
    if (slug) {
      navigate(`/categories/${slug}`);
    } else {
      navigate("/categories");
    }
  };

  const activeCategoryData = categories.find(
    (c) => c.slug === activeCategory
  );

  return (
    <section className="container-app py-12">
      <SectionHeading
        eyebrow="Browse by category"
        title="Explore Categories"
        subtitle="Find your next favourite dish by browsing our categories."
      />

      <div className="mb-8">
        <CategoryChips
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <CategorySidebar activeCategory={activeCategory} />
        </div>

        <div className="lg:col-span-9">
          {activeCategoryData && (
            <div className="mb-6 flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                {activeCategoryData.image ? (
                  <img
                    src={activeCategoryData.image}
                    alt={activeCategoryData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white/90">
                    {activeCategoryData.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-gray-900">
                  {activeCategoryData.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeCategoryData.description}
                </p>
              </div>
            </div>
          )}

          {feed.isLoading ? (
            <FoodGridSkeleton />
          ) : feed.hasError ? (
            <ErrorState
              title="Couldn't load categories"
              message="We hit a snag while fetching items. Please try again."
              onRetry={feed.retry}
            />
          ) : feed.foods.length === 0 ? (
            <EmptyState
              icon={<FaUtensils />}
              title="No dishes found"
              message={
                activeCategory
                  ? `No dishes in ${activeCategoryData?.name ?? "this category"}. Try another category.`
                  : "No dishes available right now."
              }
              action={
                activeCategory ? (
                  <button
                    onClick={() => handleSelectCategory("")}
                    className="btn-primary"
                  >
                    Show all dishes
                  </button>
                ) : undefined
              }
            />
          ) : (
            <>
              {!feed.isLoading && !feed.hasError && feed.foods.length > 0 && (
                <p className="mb-6 text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {feed.foods.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {feed.total}
                  </span>{" "}
                  dishes
                </p>
              )}
              <FoodGrid foods={feed.foods} />
              <div ref={feed.sentinelRef} />
              {feed.hasMore && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <button
                    onClick={feed.loadMore}
                    disabled={feed.isFetchingMore}
                    className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand disabled:opacity-50"
                  >
                    {feed.isFetchingMore ? (
                      <>
                        <FaSpinner className="animate-spin" size={13} />{" "}
                        Loading...
                      </>
                    ) : (
                      "Load more"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;