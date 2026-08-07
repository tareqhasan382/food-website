import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaFilter,
  FaRedo,
  FaSearch,
  FaSpinner,
  FaStar,
  FaUtensils,
} from "react-icons/fa";
import { useFoodFeed } from "../hooks/useFoodFeed";
import { useCategories } from "../hooks/useCategories";
import SectionHeading from "../components/ui/SectionHeading";
import Select from "../components/ui/Select";
import FoodGrid from "../components/food/FoodGrid";
import FoodGridSkeleton from "../components/food/FoodGridSkeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

type SortOption = "latest" | "low" | "high" | "popular";

const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const availability = searchParams.get("availability");
  const sortParam = searchParams.get("sort") ?? "latest";

  const [sort, setSort] = useState<SortOption>(sortParam as SortOption);
  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [showFilters, setShowFilters] = useState(false);

  const [priceMin, setPriceMin] = useState<number>(
    minPrice ? Number(minPrice) : 0
  );
  const [priceMax, setPriceMax] = useState<number>(
    maxPrice ? Number(maxPrice) : 50
  );
  const [rating, setRating] = useState<string>(minRating ?? "");
  const [availableOnly, setAvailableOnly] = useState<boolean>(
    availability === "true"
  );

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setSort(sortParam as SortOption);
  }, [sortParam]);

  useEffect(() => {
    setPriceMin(minPrice ? Number(minPrice) : 0);
  }, [minPrice]);

  useEffect(() => {
    setPriceMax(maxPrice ? Number(maxPrice) : 50);
  }, [maxPrice]);

  useEffect(() => {
    setRating(minRating ?? "");
  }, [minRating]);

  useEffect(() => {
    setAvailableOnly(availability === "true");
  }, [availability]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const setParam = (key: string, value: string): void => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const setNumericParam = (key: string, value: number): void => {
    if (value > 0) setParam(key, String(value));
    else setParam(key, "");
  };

  useEffect(() => {
    if (debouncedSearch !== search) setParam("search", debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const feedOptions = useMemo(() => {
    const base = {
      searchTerm: debouncedSearch || undefined,
      category: category || undefined,
      minPrice: priceMin > 0 ? priceMin : undefined,
      maxPrice: priceMax < 50 ? priceMax : undefined,
      minRating: rating ? Number(rating) : undefined,
      availability: availableOnly ? true : undefined,
    };
    switch (sort) {
      case "low":
        return { ...base, sortBy: "price" as const, sortOrder: "asc" as const };
      case "high":
        return { ...base, sortBy: "price" as const, sortOrder: "desc" as const };
      case "popular":
        return { ...base, popular: true };
      default:
        return { ...base, sortBy: "newest" as const, sortOrder: "desc" as const };
    }
  }, [
    debouncedSearch,
    category,
    priceMin,
    priceMax,
    rating,
    availableOnly,
    sort,
  ]);

  const feed = useFoodFeed(feedOptions);

  const hasFilters = Boolean(
    search ||
      category ||
      priceMin > 0 ||
      priceMax < 50 ||
      rating ||
      availableOnly
  );

  const clearFilters = (): void => {
    setSearchParams({});
    setSort("latest");
    setSearchInput("");
    setDebouncedSearch("");
    setPriceMin(0);
    setPriceMax(50);
    setRating("");
    setAvailableOnly(false);
  };

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = Number(e.target.value);
    setPriceMin(val);
    setNumericParam("minPrice", val);
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = Number(e.target.value);
    setPriceMax(val);
    setNumericParam("maxPrice", val);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const val = e.target.value;
    setRating(val);
    setParam("minRating", val);
  };

  const handleAvailabilityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const val = e.target.checked;
    setAvailableOnly(val);
    if (val) setParam("availability", "true");
    else setParam("availability", "");
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const val = e.target.value as SortOption;
    setSort(val);
    setParam("sort", val);
  };

  return (
    <section className="container-app py-12">
      <SectionHeading
        eyebrow="Our kitchen"
        title="Explore the Menu"
        subtitle="Search, filter and sort our full menu to find your next favourite."
      />

      {/* Toolbar */}
      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setParam("category", "")}
              className={`btn !py-1.5 text-sm ${
                category === ""
                  ? "btn-primary"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setParam("category", cat.slug)}
                className={`btn !py-1.5 text-sm capitalize ${
                  category === cat.slug
                    ? "btn-primary"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={13}
              />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search dishes, burgers, pizza..."
                className="input !pl-9"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn !py-1.5 text-sm ${
                  showFilters
                    ? "btn-primary"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaFilter size={12} /> Filters
              </button>

              <label
                htmlFor="sort"
                className="text-sm font-semibold text-gray-600"
              >
                Sort by
              </label>
              <Select
                id="sort"
                value={sort}
                onChange={handleSortChange}
                className="!w-auto"
                options={[
                  { value: "latest", label: "Latest" },
                  { value: "low", label: "Price: Low to High" },
                  { value: "high", label: "Price: High to Low" },
                  { value: "popular", label: "Popular" },
                ]}
              />

              {hasFilters && (
                <button onClick={clearFilters} className="btn-ghost !px-3">
                  <FaRedo size={12} /> Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Price Range */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Price Range
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={priceMin}
                  onChange={handlePriceMinChange}
                  className="w-full accent-brand"
                />
                <span className="w-16 text-right text-sm font-medium text-gray-600">
                  ${priceMin}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={priceMax}
                  onChange={handlePriceMaxChange}
                  className="w-full accent-brand"
                />
                <span className="w-16 text-right text-sm font-medium text-gray-600">
                  ${priceMax}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                ${priceMin} — ${priceMax}
              </p>
            </div>

            {/* Rating Filter */}
            <div>
              <label
                htmlFor="rating"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Minimum Rating
              </label>
              <Select
                id="rating"
                value={rating}
                onChange={handleRatingChange}
                options={[
                  { value: "", label: "Any Rating" },
                  { value: "4", label: "4+ Stars" },
                  { value: "3", label: "3+ Stars" },
                  { value: "2", label: "2+ Stars" },
                  { value: "1", label: "1+ Stars" },
                ]}
              />
            </div>

            {/* Availability Filter */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Availability
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={handleAvailabilityChange}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm text-gray-600">Available Only</span>
              </label>
            </div>

            {/* Active Filters Summary */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Active Filters
              </label>
              <div className="flex flex-wrap gap-2">
                {priceMin > 0 && (
                  <span className="badge bg-brand-100 text-brand">
                    Min ${priceMin}
                  </span>
                )}
                {priceMax < 50 && (
                  <span className="badge bg-brand-100 text-brand">
                    Max ${priceMax}
                  </span>
                )}
                {rating && (
                  <span className="badge bg-brand-100 text-brand">
                    <FaStar size={10} className="mr-1" /> {rating}+
                  </span>
                )}
                {availableOnly && (
                  <span className="badge bg-brand-100 text-brand">
                    Available
                  </span>
                )}
                {!hasFilters && (
                  <span className="text-xs text-gray-400">No active filters</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!feed.isLoading && !feed.hasError && feed.foods.length > 0 && (
        <p className="mb-6 text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">{feed.foods.length}</span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">{feed.total}</span>{" "}
          dishes
        </p>
      )}

      {feed.isLoading ? (
        <FoodGridSkeleton />
      ) : feed.hasError ? (
        <ErrorState
          title="Couldn't load the menu"
          message="We hit a snag while fetching the menu. Please try again."
          onRetry={feed.retry}
        />
      ) : feed.foods.length === 0 ? (
        <EmptyState
          icon={<FaUtensils />}
          title="No dishes found"
          message="Try adjusting your filters or search terms."
          action={
            <button onClick={clearFilters} className="btn-primary">
              <FaRedo size={13} /> Reset all filters
            </button>
          }
        />
      ) : (
        <>
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
                    <FaSpinner className="animate-spin" size={13} /> Loading...
                  </>
                ) : (
                  "Load more"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default MenuPage;