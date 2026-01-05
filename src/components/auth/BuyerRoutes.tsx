import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";
import BuyerDashboard from "../../pages/dashboards/BuyerDashboard";
import ProfilePage from "../../pages/profile/profilePage";
// import BuyersListPage from "../../pages/user/auth/buyers";
import StorePage from "../../pages/store/store";
// import SellersListPage from "../../pages/user/auth/sellers";
import AddCategoriesPage from "../../pages/addCategories/addCategories";

const BuyerRoutes = () => (
  <Routes>
    <Route
      path="/*"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
        <Route path="dashboard/*" element={
        <ProtectedRoute allowedRoles={['buyer']}>
            <BuyerDashboard />
        </ProtectedRoute>
        } />
      <Route path="profile" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer', 'seller']}>
          <ProfilePage />
        </ProtectedRoute>
      } />
      {/* <Route path="buyers" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer']}>
          <BuyersListPage />
        </ProtectedRoute>
      } /> */}
      <Route path="store" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer']}>
          <StorePage />
        </ProtectedRoute>
      } />
      {/* <Route path="sellers" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer']}>
          <SellersListPage />
        </ProtectedRoute>
      } /> */}
      <Route path="add-categories" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer']}>
          <AddCategoriesPage />
        </ProtectedRoute>
      } />
    </Route>
  </Routes>
);

export default BuyerRoutes;