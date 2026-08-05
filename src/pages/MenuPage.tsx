import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaRedo } from "react-icons/fa";
import { useAppSelector } from "../redux/hooks";
import SectionHeading from "../components/ui/SectionHeading";
import FoodGrid from "../components/food/FoodGrid";

const PAGE_SIZE = 8;

type SortOption = "featured" | "low" | "high" | "rating";

const MenuPage: React.FC = () => {
  const foods = useAppSelector((state) => state.food);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const categories = useMemo(
    () => Array.from(new Set(foods.map((f) => f.category))),
    [foods]
  );

  const filtered = useMemo(() => {
    let list = [...foods];
    if (category) {
      list = list.filter((f) => f.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.includes(q) ||
          f.tags.some((t) => t.includes(q))
      );
    }
    switch (sort) {
      case "low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort(
          (a, b) => Number(b.featured) - Number(a.featured)
        );
    }
    return list;
  }, [foods, search, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setParam = (key: "search" | "category", value: string): void => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const hasFilters = Boolean(search || category);

  const clearFilters = (): void => {
    setSearchParams({});
    setSort("featured");
  };

  return (
    <section className="container-app py-12">
      <SectionHeading
        eyebrow="Our kitchen"
        title="Explore the Menu"
        subtitle="Search, filter and sort our full menu to find your next favourite."
      />

      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 lg:flex-row lg:items-center lg:justify-between">
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
              key={cat}
              onClick={() => setParam("category", cat)}
              className={`btn !py-1.5 text-sm capitalize ${
                category === cat
                  ? "btn-primary"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-semibold text-gray-600">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="input !w-auto"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost !px-3">
              <FaRedo size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      <FoodGrid foods={visible} />

      {filtered.length > 0 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand disabled:opacity-40"
          >
            <FaChevronLeft size={12} /> Prev
          </button>
          <span className="text-sm font-semibold text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand disabled:opacity-40"
          >
            Next <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </section>
  );
};

export default MenuPage;
