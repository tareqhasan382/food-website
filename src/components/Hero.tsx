import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaTruck, FaStar } from "react-icons/fa";

const Hero: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    navigate(
      search.trim() ? `/menu?search=${encodeURIComponent(search.trim())}` : "/menu"
    );
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80"
          alt="Delicious spread of food"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-gray-950/30" />
      </div>

      <div className="container-app relative py-24 sm:py-28 lg:py-36">
        <div className="max-w-2xl animate-fade-up">
          <span className="badge mb-4 bg-white/15 text-white backdrop-blur">
            <FaStar className="text-amber-400" /> Rated 4.8/5 by 2,000+ happy
            customers
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            The Best <span className="text-brand-300">Foods</span>
            <br />
            Delivered to your door
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-200">
            Fresh ingredients, bold flavours and lightning-fast delivery.
            Order your favourites and enjoy them hot at home.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-2xl"
          >
            <IoSearch className="ml-3 text-xl text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search burgers, pizza, salads…"
              className="w-full bg-transparent px-2 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              aria-label="Search foods"
            />
            <button type="submit" className="btn-primary shrink-0">
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/menu" className="btn-primary">
              Order now
            </Link>
            <Link
              to="/menu"
              className="btn bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              View full menu
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-200">
            <span className="flex items-center gap-2">
              <FaTruck className="text-brand-300" /> Free delivery over $25
            </span>
            <span className="flex items-center gap-2">
              <span className="text-brand-300">🔥</span> Prepared fresh daily
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
