import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";
import SellerDashboard from "../../pages/dashboards/SellerDashboard";
import ProfilePage from "../../pages/profile/profilePage";
import { lazy } from "react";
import InventoryPage from "../../pages/inventory/Inventory";
import ActivityLogPage from "../../pages/activityLog/activityLog";
import AllPrivateProductsPage from "../../pages/products/allProducts";
import MyOrder from "../../pages/orders/MyOrder";
// import StorePage from "../../pages/store/store";

const AddProductPage = lazy(() => import("../../pages/products/addProduct"));
const EditProductPage = lazy(() => import("../../pages/products/editProduct"));

const StorePage = lazy(() => import("../../pages/store/store"));
const AddListingPage = lazy(() => import("../../pages/inventory/AddListing"));
const SellerOrders = lazy(() => import("../../pages/order/sellerOrders"))
const MyAttributesLayout = lazy(() => import("../../pages/myAttributes/Layout"));
const MyTraitsPage = lazy(() => import("../../pages/myAttributes/TraitsPage"));
const MyTagsPage = lazy(() => import("../../pages/myAttributes/TagsPage"));
const SellerOrder = lazy(() => import("../../pages/orders/SellerOrder"));

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
        <ProtectedRoute allowedRoles={['buyer', 'seller']}>
          <InventoryPage />
        </ProtectedRoute>
      } />
      <Route path="seller/orders" element={
        <ProtectedRoute allowedRoles={['seller', 'superadmin', 'admin']}>
          <SellerOrder />
        </ProtectedRoute>
      } />
      <Route path="seller/customer-orders" element={
        <ProtectedRoute allowedRoles={['seller', 'superadmin', 'admin', 'buyer']}>
          <MyOrder />
        </ProtectedRoute>
      } />
      <Route path="add-listing" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <AddListingPage />
        </ProtectedRoute>
      } />
      <Route path="store" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer', 'seller']}>
          <StorePage />
        </ProtectedRoute>
      } />
      <Route
        path="my-attributes"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <MyAttributesLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="traits" replace />} />
        <Route path="traits" element={<MyTraitsPage />} />
        <Route path="tags" element={<MyTagsPage />} />
      </Route>
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

      <Route path="activity-logs" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <ActivityLogPage />
        </ProtectedRoute>
      } />

      <Route path="seller/orders" element={
        <ProtectedRoute allowedRoles={['seller']}>
          <SellerOrders />
        </ProtectedRoute>
      } />
      <Route path="products/edit/:id" element={
        <ProtectedRoute allowedRoles={['seller', 'buyer']}>
          <EditProductPage />
        </ProtectedRoute>
      } />
    </Route>
  </Routes>
);

export default SellerRoutes;