import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";
import SellerDashboard from "../../pages/dashboards/SellerDashboard";
import ProfilePage from "../../pages/profile/profilePage";
import { lazy } from "react";

// Lazy load product pages
const AllProductsPage = lazy(() => import("../../pages/products/allProducts"));
const AddProductPage = lazy(() => import("../../pages/products/addProduct"));

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
      <Route path="products" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <AllProductsPage />
        </ProtectedRoute>
      } />
      <Route path="products/add" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <AddProductPage />
        </ProtectedRoute>
      } />
    </Route>
  </Routes>
);

export default SellerRoutes;