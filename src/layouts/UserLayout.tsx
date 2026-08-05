import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/guards/ScrollToTop";

const UserLayout: React.FC = () => (
  <div className="flex min-h-screen flex-col">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default UserLayout;
