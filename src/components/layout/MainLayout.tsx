import { Outlet } from "react-router";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import AppSidebar from "./AppSidebar";
import Backdrop from "./BackDrop";
import { useSidebar } from "../../contexts/SidebarContext";
import { useAuth } from "../../contexts/AuthContext";

const MainLayout = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Compute margin based on sidebar state AND authentication
  const mainMargin = isAuthenticated
    ? isExpanded || isHovered
      ? "xl:ml-[260px]"
      : "xl:ml-[80px]"
    : "ml-0"; // full width when not authenticated

  return (
    <div className="min-h-screen dark:bg-black xl:flex">
      {isAuthenticated && (
        <>
          <AppSidebar />
          <Backdrop />
        </>
      )}

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainMargin} ${isMobileOpen ? "ml-0" : ""}`}
      >
        <Navbar />
        <div className=" mx-auto max-w-(--breakpoint-2xl)">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
