import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";
import SellerDashboard from "../../pages/dashboards/SellerDashboard";
import ProfilePage from "../../pages/profile/profilePage";
import { lazy } from "react";
import InventoryPage from "../../pages/inventory/Inventory";
import ActivityLogPage from "../../pages/activityLog/activityLog";
import AllPrivateProductsPage from "../../pages/products/allProducts";
// import StorePage from "../../pages/store/store";

// Lazy load product pages
const AddProductPage = lazy(() => import("../../pages/products/addProduct"));
const EditProductPage = lazy(() => import("../../pages/products/editProduct"));

const StorePage = lazy(() => import("../../pages/store/store"));
const AddListingPage = lazy(() => import("../../pages/inventory/AddListing"));

const SellerRoutes = () => (
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
        <ProtectedRoute allowedRoles={['seller']}>
          <SellerDashboard />
        </ProtectedRoute>
      } />
      <Route path="profile" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer', 'seller']}>
          <ProfilePage />
        </ProtectedRoute>
      } />
            <Route path="inventory" element={
        <ProtectedRoute allowedRoles={[ 'buyer', 'seller']}>
          <InventoryPage />
        </ProtectedRoute>
      } />
      <Route path="add-listing" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <AddListingPage />
        </ProtectedRoute>
      } />
         <Route path="store" element={
              <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer','seller']}>
                <StorePage />
              </ProtectedRoute>
            } />
      <Route path="products" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <AllPrivateProductsPage />
        </ProtectedRoute>
      } />
      <Route path="products/add" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <AddProductPage />
        </ProtectedRoute>
      } />

            <Route path="activity-log" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <ActivityLogPage />
        </ProtectedRoute>
      } />
      <Route path="products/edit/:id" element={
        <ProtectedRoute allowedRoles={['seller','buyer']}>
          <EditProductPage />
        </ProtectedRoute>
      } />
    </Route>
  </Routes>
);

export default SellerRoutes;