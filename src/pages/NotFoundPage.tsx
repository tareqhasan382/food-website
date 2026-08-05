import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFoundPage: React.FC = () => (
  <section className="container-app flex min-h-[60vh] items-center justify-center py-16">
    <div className="text-center">
      <p className="font-display text-8xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-gray-900">
        Page not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-gray-500">
        Sorry, we couldn't find the page you're looking for. It may have been
        moved or deleted.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn-primary">
          <FaHome size={15} />
          Go back home
        </Link>
        <Link to="/menu" className="btn-outline">
          Browse menu
        </Link>
      </div>
    </div>
  </section>
);

export default NotFoundPage;
