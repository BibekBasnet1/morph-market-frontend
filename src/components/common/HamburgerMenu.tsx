import { Link } from "react-router";
import { User, X } from "lucide-react";
import { Button } from "../ui/button";
import "./HamburgerMenu.css";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu = ({ isOpen, onClose }: HamburgerMenuProps) => {
  return (
    <>
      {/* Semi-transparent Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] transition-opacity" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`hamburger-menu ${isOpen ? "open" : ""} bg-white dark:bg-gray-900 z-[9999]`}>
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6 mt-10">
          {/* Only Auth Buttons inside Hamburger */}
          <Link to="/login" onClick={onClose}>
            <Button variant="outline" className="w-full flex justify-center gap-2 border-gray-300 text-gray-900 dark:text-white">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          </Link>

          <Link to="/register" onClick={onClose}>
            <Button className="w-full bg-green-600 text-white hover:bg-green-700 font-semibold">
              Join Community
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;