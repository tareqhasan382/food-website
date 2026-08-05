import { useNavigate } from "react-router-dom";
import { categories } from "../data/data";
import SectionHeading from "./ui/SectionHeading";

const Category: React.FC = () => {
  const navigate = useNavigate();

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
            key={cat.id}
            onClick={() => navigate(`/menu?category=${cat.slug}`)}
            className="group card overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
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
