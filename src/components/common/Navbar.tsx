import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, User, Search, X, Menu } from "lucide-react";

import { useSidebar } from "../../contexts/SidebarContext";
import { useAuth } from "../../contexts/AuthContext";

import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import UserDropdown from "../../components/header/UserDropDown";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar();
  const { user } = useAuth();
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Main row */}
      <div className="flex items-center justify-between px-3 py-3 sm:px-4 xl:px-6">

        {/* LEFT: Sidebar toggle + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar toggle: always shown when authenticated */}
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

          {/* Logo: always show on mobile/tablet, hide when authenticated on xl+ */}
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

        {/* CENTER: Search (hidden on mobile, shown md+, wider on xl) */}
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

          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Heart className="h-5 w-5 text-gray-500 hover:text-red-500" />
          </Button>

          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5 text-gray-500 hover:text-blue-500" />
            </Button>
          </Link>

          <ThemeToggleButton />

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Sign In</span>
                </Button>
              </Link>

              {/* Mobile: just icon for sign in */}
              <Link to="/login" className="sm:hidden">
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>

              <Link to="/register" className="hidden md:block">
                <Button size="sm">Join Community</Button>
              </Link>
            </>
          ) : (
            <UserDropdown />
          )}
        </div>
      </div>

      {/* Mobile search bar (slides in below main row) */}
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
  );
};

export default Navbar;