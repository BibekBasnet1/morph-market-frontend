
import { Link } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Heart, ShoppingCart, User } from "lucide-react";

import { ThemeToggleButton } from "../common/ThemeToggleButton";
import NotificationDropdown from "../header/NotificationDropDown";
import UserDropdown from "../header/UserDropDown";
import { useAuth } from "../../contexts/AuthContext";


const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
const { user } = useAuth();
const isAuthenticated = !!user;
  return (
    <nav className="sticky dark:text-white top-0 z-50 bg-white border-b border-border dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
           {/* {!isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐍</span>
            <span className="font-serif text-xl font-bold text-black dark:text-white">
              SerpentMarket
            </span>
            </Link>
          </div>
          ) : (null)} */}

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <Input
              type="text"
              placeholder="Search snakes, morphs, sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

         {/* Desktop Actions */}
<div className="hidden md:flex items-center gap-3">
  <Button variant="ghost" size="icon">
    <Heart className="h-5 w-5" />
  </Button>

  <Button variant="ghost" size="icon">
    <ShoppingCart className="h-5 w-5" />
  </Button>

  {/* Dark mode always visible */}
  <ThemeToggleButton />

  {!isAuthenticated ? (
    <>
      <Link to="/login">
        <Button variant="outline" className="gap-2">
          <User className="h-4 w-4" />
          Sign In
        </Button>
      </Link>

      <Link to="/login">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Start Selling
        </Button>
      </Link>
    </>
  ) : (
    <>
      <NotificationDropdown />
      <UserDropdown />
    </>
  )}
</div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-4">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

           <div className="flex items-center justify-between">
  <ThemeToggleButton />

  {isAuthenticated && (
    <>
      <NotificationDropdown />
      <UserDropdown />
    </>
  )}
</div>

{!isAuthenticated && (
  <div className="flex gap-2">
    <Link to="/login" className="flex-1">
      <Button variant="outline" className="w-full">
        Sign In
      </Button>
    </Link>
    <Link to="/login" className="flex-1">
      <Button className="w-full">Start Selling</Button>
    </Link>
  </div>
)}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
