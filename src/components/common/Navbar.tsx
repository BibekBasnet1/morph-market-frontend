import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, User, Search, X, Menu, Settings, LogOut } from "lucide-react";

import { useSidebar } from "../../contexts/SidebarContext";
import { useAuth } from "../../contexts/AuthContext";

import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import UserDropdown from "../../components/header/UserDropDown";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1280) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    if (!navDrawerOpen) return;
    const handler = (e: MouseEvent) => {
      const drawer = document.getElementById("nav-drawer");
      if (drawer && !drawer.contains(e.target as Node)) {
        setNavDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [navDrawerOpen]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = navDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navDrawerOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    // { to: "/shop", label: "Shop" },
    // { to: "/about", label: "About" },
    // { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* Main row */}
        <div className="flex items-center justify-between px-3 py-3 sm:px-4 xl:px-6">

          {/* LEFT: Sidebar toggle + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <button
                className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400 ${
                  isMobileOpen ? "bg-gray-100 dark:bg-white/[0.03]" : ""
                }`}
                onClick={handleSidebarToggle}
                aria-label="Toggle Sidebar"
              >
                {isMobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}

            <Link
              to="/"
              className={`flex items-center gap-1.5 sm:gap-2 ${
                isAuthenticated ? "xl:hidden" : ""
              }`}
            >
              <span className="text-xl sm:text-2xl">🐍</span>
              <span className="font-serif text-base hidden sm:block sm:text-xl font-bold text-black dark:text-white whitespace-nowrap">
                ExoticPetsMarket
              </span>
            </Link>
          </div>

          {/* CENTER: Search */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-4 xl:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                placeholder="Search..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-transparent pl-9 pr-16 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 dark:border-gray-800 dark:text-white dark:focus:border-blue-700"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hidden lg:block">
                Ctrl+K
              </span>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </Button>

            {/* xl+: original UX */}
            <Button variant="ghost" size="icon" className="hidden xl:flex">
              <Heart className="h-5 w-5 text-gray-500 hover:text-red-500" />
            </Button>

            <Link to="/cart" className="hidden xl:block">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5 text-gray-500 hover:text-blue-500" />
              </Button>
            </Link>

            <ThemeToggleButton />

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hidden xl:block">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">Sign In</span>
                  </Button>
                </Link>
                <Link to="/register" className="hidden xl:block">
                  <Button size="sm">Join Community</Button>
                </Link>
              </>
            ) : (
              <div className="hidden xl:block">
                <UserDropdown />
              </div>
            )}

            {/* Right nav hamburger — smaller screens only */}
            <button
              onClick={() => setNavDrawerOpen((v) => !v)}
              className="xl:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                autoFocus
                placeholder="Search..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-transparent pl-9 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:text-white"
              />
            </div>
          </div>
        )}
      </header>

      {/* Backdrop */}
      {navDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Right-side Drawer */}
      <div
        id="nav-drawer"
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          navDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐍</span>
            <span className="font-serif font-bold text-gray-900 dark:text-white">
              ExoticPetsMarket
            </span>
          </div>
          <button
            onClick={() => setNavDrawerOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex flex-col h-[calc(100%-65px)] overflow-y-auto">
          {/* Nav Links */}
          <nav className="px-3 py-4 flex-1">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 px-3 mb-2">
              Navigation
            </p>
            <ul className="space-y-0.5">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setNavDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

            {/* Quick Actions */}
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 px-3 mb-2">
              Quick Actions
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  to="/cart"
                  onClick={() => setNavDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  onClick={() => setNavDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Heart className="w-4 h-4 text-gray-400" />
                  Wishlist
                </Link>
              </li>
            </ul>
          </nav>

          {/* Auth Section — pinned to bottom */}
          {isAuthenticated ? (
            <div className="px-4 py-5 border-t border-gray-100 dark:border-gray-800">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name ?? "My Account"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {user?.email ?? ""}
                  </p>
                </div>
              </div>

              {/* Account Links */}
              <ul className="space-y-0.5 mb-4">
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setNavDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    onClick={() => setNavDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    onClick={() => setNavDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </Link>
                </li>
              </ul>

              {/* Sign Out */}
              <Link to="/login">
              <Button
                variant="outline"
                className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20"
                onClick={() => {
                  setNavDrawerOpen(false);
                  logout();
                }}
                >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
                </Link>
            </div>
          ) : (
            <div className="px-4 py-5 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <Link to="/login" onClick={() => setNavDrawerOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setNavDrawerOpen(false)}>
                <Button className="w-full">Join Community</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;