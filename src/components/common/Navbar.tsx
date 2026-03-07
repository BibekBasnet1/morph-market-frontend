import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, User, Search, X, Menu, Settings, LogOut, Castle } from "lucide-react";
import { useCart } from "../../hooks/useCart";

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

  const { count: cartCount } = useCart();

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
    { to: "/store-directory", label: "Shop" },
    // { to: "/about", label: "About" },
    // { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Navbar — clean white bar with green accents (marketplace-style) */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 xl:px-6">

          {/* LEFT: Sidebar toggle + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <button
                className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-gray-600 border border-gray-200 dark:border-gray-700 dark:text-gray-400 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors ${
                  isMobileOpen ? "bg-primary/10 border-primary/30 text-primary" : ""
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
              className={`flex items-center gap-1.5 sm:gap-2 group ${
                isAuthenticated ? "xl:hidden" : ""
              }`}
            >
              <span className="text-xl sm:text-2xl">🐍</span>
              <span className="font-semibold text-base hidden sm:block sm:text-lg text-primary whitespace-nowrap group-hover:text-primary/90 transition-colors dark:text-primary">
                ExoticPetsMarket
              </span>
            </Link>
          </div>

          {/* CENTER: Search */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-4 xl:mx-8">
            <div className="relative w-full flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-gray-50 dark:bg-gray-800/50">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                placeholder="Search products..."
                className="h-10 flex-1 w-full bg-transparent pl-9 pr-20 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none dark:text-white dark:placeholder:text-gray-400"
              />
              <button
                type="button"
                className="absolute right-0 top-0 bottom-0 px-4 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                aria-label="Search"
              >
                Search
              </button>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hidden xl:flex text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Heart className="h-5 w-5" />
            </Button>

            <Link to="/cart" className="hidden xl:block relative">
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-secondary rounded-full ring-2 ring-white dark:ring-gray-900">
                  {cartCount}
                </span>
              )}
            </Link>

            <ThemeToggleButton />

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hidden xl:block">
                  <Button variant="outline" size="sm" className="gap-1.5 border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">Sign In</span>
                  </Button>
                </Link>
                <Link to="/register" className="hidden xl:block">
                  <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm">
                    Join Community
                  </Button>
                </Link>
              </>
            ) : (
              <div className="hidden xl:block">
                <UserDropdown />
              </div>
            )}

            <button
              onClick={() => setNavDrawerOpen((v) => !v)}
              className="xl:hidden flex items-center justify-center font-semibold text-sm px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20
              dark:text-white           transition-colors"
              aria-label="Open navigation menu"
            >
              MENU
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 pb-3">
            <div className="relative flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-gray-50 dark:bg-gray-800/50">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                autoFocus
                placeholder="Search products..."
                className="h-10 w-full bg-transparent pl-9 pr-4 text-sm text-gray-800 focus:outline-none dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary/5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐍</span>
            <span className="font-semibold dark:text-white">
              ExoticPetsMarket
            </span>
          </div>
          <button
            onClick={() => setNavDrawerOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex flex-col h-[calc(100%-65px)] overflow-y-auto">
          {/* Nav Links */}
          <nav className="px-3 py-4 flex-1">
            <p className="text-[10px] uppercase tracking-widest font-semibold dark:text-white px-3 mb-2">
              Navigation
            </p>
            <ul className="space-y-0.5">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setNavDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

            {/* Quick Actions */}
            <p className="text-[10px] uppercase tracking-widest font-semibold dark:text-white px-3 mb-2">
              Quick Actions
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  to="/marketplace"
                  onClick={() => setNavDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Castle className="w-4 h-4 text-primary/80" />
                  MarketPlace
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  onClick={() => setNavDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-primary/80" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-secondary rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  onClick={() => setNavDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Heart className="w-4 h-4 text-red-400/80" />
                  Wishlist
                </Link>
              </li>
            </ul>
          </nav>

          {/* Auth Section — pinned to bottom */}
          {isAuthenticated ? (
            <div className="px-4 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <User className="w-4 h-4 text-primary/80" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    onClick={() => setNavDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 text-primary/80" />
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    onClick={() => setNavDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-primary/80" />
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
                <Button variant="outline" className="w-full gap-2 border-gray-300 hover:border-primary hover:text-primary">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setNavDrawerOpen(false)}>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Join Community</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;