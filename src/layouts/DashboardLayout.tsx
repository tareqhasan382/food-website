import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaChartPie,
  FaClipboardList,
  FaFileAlt,
  FaSignOutAlt,
  FaStore,
  FaTags,
  FaTicketAlt,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/authSlice";
import { logout as logoutRequest } from "../services/authService";
import { isAdminRole } from "../types/auth";
import { toast } from "react-toastify";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FaChartPie, end: true },
  { to: "/dashboard/orders", label: "Orders", icon: FaClipboardList },
  { to: "/dashboard/foods", label: "All Foods", icon: FaUtensils },
  { to: "/dashboard/categories", label: "Categories", icon: FaTags },
  { to: "/dashboard/users", label: "Users", icon: FaUsers },
  { to: "/dashboard/coupons", label: "Coupons", icon: FaTicketAlt },
  { to: "/dashboard/analytics", label: "Analytics", icon: FaChartLine },
  { to: "/dashboard/reports", label: "Reports", icon: FaFileAlt },
];

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    void logoutRequest().finally(() => {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/");
    });
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl text-white">
          <FaStore />
        </span>
        <div>
          <p className="font-display text-lg font-bold leading-tight text-white">
            Best Eats
          </p>
          <p className="text-xs text-white/70">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name}
            </p>
            <p className="truncate text-xs text-white/60">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="btn bg-white/10 text-white hover:bg-white/20"
          >
            View site
          </Link>
          <button
            onClick={handleLogout}
            className="btn flex-1 bg-white/10 text-white hover:bg-white/20"
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-gradient-to-b from-brand-600 to-brand-800 lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 animate-slide-in-right bg-gradient-to-b from-brand-600 to-brand-800 lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 text-white/80 hover:text-white"
              aria-label="Close menu"
            >
              <MdClose size={24} />
            </button>
            {sidebar}
          </aside>
        </>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white/90 px-4 py-3 shadow-sm backdrop-blur lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <HiMenuAlt3 size={24} />
          </button>
          <h1 className="font-display text-lg font-bold text-gray-800">
            Dashboard
          </h1>
          <span className="badge bg-brand-50 text-brand">
            {isAdminRole(user?.role) ? "Administrator" : "Member"}
          </span>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
