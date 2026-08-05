import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import SectionHeading from "../ui/SectionHeading";
import FoodGrid from "./FoodGrid";

const TopRatedSection: React.FC = () => {
  const foods = useAppSelector((state) => state.food);
  const [activeCategory, setActiveCategory] = useState<string>("");

  const categories = useMemo(
    () => Array.from(new Set(foods.map((f) => f.category))),
    [foods]
  );

  const featured = useMemo(() => {
    let list = foods.filter((f) => f.featured);
    if (activeCategory) {
      list = list.filter((f) => f.category === activeCategory);
    }
    return list.length > 0 ? list : foods;
  }, [foods, activeCategory]);

  const visible = useMemo(
    () =>
      activeCategory
        ? featured.filter((f) => f.category === activeCategory)
        : featured,
    [featured, activeCategory]
  );

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
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn !py-1.5 text-sm capitalize ${
              activeCategory === cat
                ? "btn-primary"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-brand"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <FoodGrid foods={visible.slice(0, 8)} />

      <div className="mt-10 text-center">
        <Link to="/menu" className="btn-outline">
          View full menu
        </Link>
      </div>
    </section>
  );
};

export default TopRatedSection;
