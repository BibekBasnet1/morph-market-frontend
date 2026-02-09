// import { useEffect, useRef, useState } from "react";

// import { Link } from "react-router";
// import { useSidebar } from "../../contexts/SidebarContext";
// import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
// import NotificationDropdown from "../../components/header/NotificationDropDown";
// import UserDropdown from "../../components/header/UserDropDown";
// import { useAuth } from "../../contexts/AuthContext";
// import { Button } from "../ui/button";
// import { Heart, ShoppingCart, User } from "lucide-react";

// const Navbar: React.FC = () => {
//   const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

//   const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
//    const { user } = useAuth();
//  const isAuthenticated = !!user;

//   const handleToggle = () => {
//     if (window.innerWidth >= 1280) {
//       // xl and above: use desktop sidebar behavior
//       toggleSidebar();
//     } else {
//       // Below xl: use mobile sidebar behavior
//       toggleMobileSidebar();
//     }
//   };

//   const toggleApplicationMenu = () => {
//     setApplicationMenuOpen(!isApplicationMenuOpen);
//   };

//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if ((event.metaKey || event.ctrlKey) && event.key === "k") {
//         event.preventDefault();
//         inputRef.current?.focus();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   return (
//     <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 xl:border-b">
//       <div className="flex flex-col items-center justify-between grow xl:flex-row xl:px-6">
//         <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 xl:justify-normal xl:border-b-0 xl:px-0 lg:py-4">
//           <button
//             className={`items-center justify-center  w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 flex dark:text-gray-400 lg:h-11 lg:w-11 xl:border ${
//               isMobileOpen ? "bg-gray-100 dark:bg-white/[0.03]" : ""
//             }`}
//             onClick={handleToggle}
//             aria-label="Toggle Sidebar"
//           >
//             {isMobileOpen ? (
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
//                   fill="currentColor"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 width="16"
//                 height="12"
//                 viewBox="0 0 16 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
//                   fill="currentColor"
//                 />
//               </svg>
//             )}
//           </button>
//           {!isAuthenticated ? (
//            <div className="flex items-center gap-2">
//              <Link to="/" className="flex items-center gap-2">
//              <span className="text-2xl">🐍</span>
//              <span className="font-serif text-xl font-bold text-black dark:text-white">
//                SerpentMarket
//              </span>
//              </Link>
//            </div>
//            ) : (null)}


//           <div className="hidden xl:block">
//             <form>
//               <div className="relative">
//                 <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
//                   <svg
//                     className="fill-gray-500 dark:fill-gray-400"
//                     width="20"
//                     height="20"
//                     viewBox="0 0 20 20"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       clipRule="evenodd"
//                       d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
//                       fill=""
//                     />
//                   </svg>
//                 </span>
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   placeholder="Search or type command..."
//                   className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
//                 />

//                 <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
//                   <span> Ctrl + </span>
//                   <span> K </span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//             <div className="hidden md:flex items-center gap-3">
//    <Button variant="ghost" size="icon">
//      <Heart className="h-5 w-5" />
//    </Button>

//    <Button variant="ghost" size="icon">
//      <ShoppingCart className="h-5 w-5" />
//    </Button>

//    <ThemeToggleButton />

//    {!isAuthenticated ? (
//      <>
//        <Link to="/login">
//          <Button variant="outline" className="gap-2">
//            <User className="h-4 w-4" />
//            Sign In
//          </Button>
//        </Link>

//        <Link to="/login">
//          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
//            Start Selling
//          </Button>
//        </Link>
//      </>
//    ) : (
//      <>
//        <NotificationDropdown />
//        <UserDropdown />
//      </>
//    )}
//  </div>
        
//       </div>
//     </header>
//   );
// };

// export default Navbar;
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, User, Menu, X } from "lucide-react";

import { useSidebar } from "../../contexts/SidebarContext";
import { useAuth } from "../../contexts/AuthContext";

import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import UserDropdown from "../../components/header/UserDropDown";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

  useEffect(() => {
    // Close mobile menu when window resizes to desktop size
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 box-border">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 xl:px-6 w-full max-w-full overflow-x-hidden box-border">

          {/* LEFT */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAuthenticated && (
              <button
                className={`items-center justify-center flex-shrink-0 w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 flex dark:text-gray-400 lg:h-11 lg:w-11 xl:border ${
                  isMobileOpen ? "bg-gray-100 dark:bg-white/[0.03]" : ""
                }`}
                onClick={handleSidebarToggle}
                aria-label="Toggle Sidebar"
              >
                {isMobileOpen ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            )}

            {!isAuthenticated && (
              <Link to="/" className="flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-0">
                <span className="text-xl sm:text-2xl flex-shrink-0">🐍</span>
                <span className="hidden sm:inline font-serif text-sm sm:text-xl font-bold text-black dark:text-white whitespace-nowrap">
                  SerpentMarket
                </span>
              </Link>
            )}
          </div>

          {/* CENTER (Search) */}
          {isAuthenticated && (
            <div className="hidden xl:block">
              <div className="relative">
                <input
                  ref={inputRef}
                  placeholder="Search..."
                  className="h-11 w-[420px] rounded-lg border border-gray-200 bg-transparent pl-10 pr-16 text-sm text-gray-800 focus:outline-none dark:border-gray-800 dark:text-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  Ctrl + K
                </span>
              </div>
            </div>
          )}

          {/* RIGHT */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-1 justify-end">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
              <Heart className="h-4 sm:h-5 text-gray-500 hover:text-red-500 w-4 sm:w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
                <ShoppingCart className="h-4 sm:h-5 text-gray-500 hover:text-blue-500 w-4 sm:w-5" />
              </Button>
            </Link>

            <ThemeToggleButton />

            {!isAuthenticated ? (
              <>
                {/* Desktop buttons - hidden on mobile */}
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" className="gap-2 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>

                  <Link to="/register">
                    <Button className="whitespace-nowrap">Join Community</Button>
                  </Link>
                </div>

                {/* Mobile menu button - shown only on mobile */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden flex items-center justify-center flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 sm:h-6 w-5 sm:w-6" />
                  ) : (
                    <Menu className="h-5 sm:h-6 w-5 sm:w-6" />
                  )}
                </button>
              </>
            ) : (
              <>
                <UserDropdown />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {!isAuthenticated && isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 shadow-lg z-40 md:hidden animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <span className="font-serif text-lg font-bold text-black dark:text-white">Menu</span>
                <button
                  onClick={closeMobileMenu}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2 justify-start"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block w-full"
                >
                  <Button className="w-full">Join Community</Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
