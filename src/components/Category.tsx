import { useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import SectionHeading from "./ui/SectionHeading";

const Category: React.FC = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();

  return (
    <section className="container-app py-12">
      <SectionHeading
        eyebrow="Explore"
        title="Top Rated Categories"
        subtitle="From juicy burgers to fresh salads — pick your craving."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => navigate(`/categories/${cat.slug}`)}
            className="group card overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-32 overflow-hidden">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-4xl font-bold text-white/90">
                  {cat.name.charAt(0)}
                </div>
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-2 left-3 font-display text-lg font-bold text-white">
                {cat.name}
              </h3>
            </div>
            <p className="truncate px-3 py-2.5 text-xs text-gray-500">
              {cat.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Category;
