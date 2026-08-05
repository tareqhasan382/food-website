import { Link } from "react-router-dom";
import { promotions } from "../data/data";
import type { IPromotion } from "../types/food";

const HeroCards: React.FC = () => (
  <section className="container-app py-10">
    <div className="grid gap-6 md:grid-cols-3">
      {promotions.map((promo: IPromotion) => (
        <div
          key={promo.id}
          className="group relative overflow-hidden rounded-2xl shadow-md"
        >
          <img
            src={promo.image}
            alt={promo.title}
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <span className="absolute left-3 top-3 badge bg-brand text-white shadow">
            {promo.badge}
          </span>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-xs uppercase tracking-wider text-brand-300">
              {promo.validUntil}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold">
              {promo.title}
            </h3>
            <p className="mt-1 text-sm text-gray-200">{promo.subtitle}</p>
            <Link
              to="/menu"
              className="mt-3 inline-block text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              Order now →
            </Link>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default HeroCards;
