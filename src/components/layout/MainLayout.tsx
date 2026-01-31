import type { ReactNode } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import AppSidebar from "./AppSidebar";
import Backdrop from "./BackDrop";
import { useSidebar } from "../../contexts/SidebarContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const location = useLocation();

  // Routes where sidebar should be hidden even when rendering MainLayout
  const hideSidebarPaths = ["/login", "/register", "/verifyOtp"];
  const isHideSidebarRoute = hideSidebarPaths.includes(location.pathname);

  // Compute margin based on sidebar state AND authentication
  const mainMargin = !isAuthenticated || isHideSidebarRoute
    ? "ml-0"
    : isExpanded || isHovered
    ? "xl:ml-[260px]"
    : "xl:ml-[80px]";

  return (
    <div className="min-h-screen dark:bg-black xl:flex">
      {isAuthenticated && !isHideSidebarRoute && (
        <>
          <AppSidebar />
          <Backdrop />
        </>
      )}

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainMargin} ${isMobileOpen ? "ml-0" : ""}`}
      >
        <Navbar />
        <div className=" mx-auto">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
