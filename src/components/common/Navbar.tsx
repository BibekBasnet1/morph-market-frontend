import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, User, Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import UserDropdown from "../../components/header/UserDropDown";
import { Button } from "../ui/button";
import HamburgerMenu from "./HamburgerMenu";

const Navbar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [menuOpen, setMenuOpen] = useState(false);

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
    // overflow-x-hidden thapera scroll hune problem fix gareko
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-x-hidden">
      <div className="flex items-center justify-between px-3 py-3 xl:px-6 w-full max-w-full">
        
        {/* LEFT: Logo - flex-shrink-0 le garda mobile ma Logo thichidaina */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl">🐍</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-black dark:text-white truncate">
              SerpentMarket
            </span>
          </Link>
        </div>

        {/* RIGHT: Icons and Menu */}
        <div className="flex items-center gap-1 sm:gap-4 ml-auto">
          
          {/* Icons: Heart, Cart, Theme - Always Outside */}
          <div className="flex items-center gap-0.5 sm:gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 dark:text-gray-300">
              <Heart className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 dark:text-gray-300">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <ThemeToggleButton />
          </div>

          {/* Auth Buttons: Desktop only */}
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="gap-2 border-gray-300 text-gray-900 dark:text-white">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  Join Community
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:block">
              <UserDropdown />
            </div>
          )}

          {/* Hamburger: Mobile Only */}
          <div className="flex md:hidden ml-1">
            <button
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Component */}
      <HamburgerMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
      />
    </header>
  );
};

export default Navbar;