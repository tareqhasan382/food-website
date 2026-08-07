import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaCartPlus,
  FaChevronDown,
  FaClipboardList,
  FaHeart,
  FaLock,
  FaSignOutAlt,
  FaStore,
} from "react-icons/fa";
import { IoSearch, IoCloseSharp } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/authSlice";
import { logout as logoutRequest } from "../services/authService";
import { isAdminRole } from "../types/auth";
import toast from "react-hot-toast";
import CartDrawer from "./cart/CartDrawer";
import { selectCartItemCount, clearCart } from "../redux/cardSlice";
import { selectWishlistCount, clearWishlist } from "../redux/wishlistSlice";
import { baseApi } from "../redux/api/baseApi";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartCount = useAppSelector(selectCartItemCount);
  const wishlistCount = useAppSelector(selectWishlistCount);

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/menu?search=${encodeURIComponent(q)}` : "/menu");
    setMobileOpen(false);
  };

  const handleLogout = (): void => {
    void logoutRequest().finally(() => {
      dispatch(logout());
      dispatch(clearCart());
      dispatch(clearWishlist());
      dispatch(baseApi.util.resetApiState());
      toast.success("Logged out successfully");
      setUserMenuOpen(false);
      navigate("/");
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 shadow-sm backdrop-blur">
      <div className="container-app flex items-center justify-between gap-3 py-3 sm:gap-4">
        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-base text-white sm:h-9 sm:w-9 sm:text-lg">
            <FaStore />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-gray-900 sm:text-2xl">
            Best<span className="text-brand">Eats</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 max-w-sm lg:block"
        >
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search foods…"
              className="input pl-9"
              aria-label="Search foods"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-red-500 hover:text-white sm:h-10 sm:w-10"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <FaHeart size={17} className="sm:h-[18px] sm:w-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-brand hover:text-white sm:h-10 sm:w-10"
            aria-label={`Cart, ${cartCount} items`}
          >
            <FaCartPlus size={17} className="sm:h-[18px] sm:w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full bg-gray-100 p-0.5 transition-colors hover:bg-gray-200 sm:py-1 sm:pl-1 sm:pr-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="hidden text-sm font-semibold text-gray-700 sm:block">
                  {user.name?.split(" ")[0]}
                </span>
                <FaChevronDown size={12} className="hidden text-gray-500 sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 animate-fade-in rounded-2xl bg-white p-2 shadow-xl ring-1 ring-gray-100">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="truncate text-sm font-bold text-gray-800">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="pt-1">
                    {isAdminRole(user.role) && (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand"
                      >
                        <FaStore size={15} />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand"
                    >
                      <FaClipboardList size={15} />
                      My orders
                    </Link>
                    <Link
                      to="/change-password"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand"
                    >
                      <FaLock size={15} />
                      Change password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt size={15} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 md:hidden sm:h-10 sm:w-10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IoCloseSharp size={21} /> : <HiMenuAlt3 size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search foods…"
                className="input pl-9"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    isActive
                      ? "bg-brand-50 text-brand"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2 ${
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <FaHeart size={14} /> Wishlist
              {wishlistCount > 0 && (
                <span className="ml-auto badge bg-red-100 text-red-600">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
            {!user && (
              <div className="mt-2 flex gap-2 border-t border-gray-100 pt-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-ghost flex-1"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
    <CartDrawer
      isOpen={cartDrawerOpen}
      onClose={() => setCartDrawerOpen(false)}
    />
    </>
  );
};

export default Navbar;
