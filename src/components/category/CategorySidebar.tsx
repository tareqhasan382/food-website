import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

interface CategorySidebarProps {
  activeCategory?: string;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  activeCategory,
}) => {
  const { categories } = useCategories();

  return (
    <aside className="hidden lg:col-span-3 lg:block">
      <div className="sticky top-6 space-y-3">
        {categories.map((cat, index) => (
          <Link
            key={cat._id}
            to={`/categories/${cat.slug}`}
            className={`group flex items-center gap-4 rounded-2xl p-3 pr-4 transition-all duration-300 hover:-translate-x-1 ${
              activeCategory === cat.slug
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                : "bg-white text-gray-700 ring-1 ring-gray-100 hover:ring-brand-300"
            }`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white/90">
                  {cat.name.charAt(0)}
                </div>
              )}
              <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10" />
            </div>
            <div className="min-w-0">
              <h3
                className={`text-sm font-bold ${
                  activeCategory === cat.slug
                    ? "text-white"
                    : "text-gray-900 group-hover:text-brand"
                }`}
              >
                {cat.name}
              </h3>
              <p
                className={`text-xs truncate ${
                  activeCategory === cat.slug
                    ? "text-white/80"
                    : "text-gray-400"
                }`}
              >
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default CategorySidebar;
