import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";
import AdminDashboard from "../../pages/dashboards/AdminDashboard";
import ProfilePage from "../../pages/profile/profilePage";
import BuyersListPage from "../../pages/user/auth/buyers";
import StorePage from "../../pages/store/store";
import SellersListPage from "../../pages/user/auth/sellers";
import AddCategoriesPage from "../../pages/addCategories/addCategories";
import { lazy } from "react";
import AddGenderPage from "../../pages/addGenders/addGenders";
import BuyerReviewPage from "../../pages/user/buyer-review";
import SellerReviewPage from "../../pages/user/sellerReview";

// Lazy load pages
const AddTraitsPage = lazy(() => import("../../pages/addTraits/addTraits"));
const AddDietPage = lazy(() => import("../../pages/addDiet/addDiet"));
const AddMaturityPage = lazy(() => import("../../pages/addMaturity/addMaturity"));
const AddOriginPage = lazy(() => import("../../pages/addOrigin/addOrigin"));
const AddTagsPage = lazy(() => import("../../pages/addTags/addTags"));
const MyAttributesLayout = lazy(() => import("../../pages/myAttributes/Layout"));
const MyTraitsPage = lazy(() => import("../../pages/myAttributes/TraitsPage"));
const MyTagsPage = lazy(() => import("../../pages/myAttributes/TagsPage"));

const AdminRoutes = () => (
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
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="profile" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer', 'seller']}>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="buyers" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer']}>
          <BuyersListPage />
        </ProtectedRoute>
      } />

      <Route path="sellers/:sellerId/review" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <SellerReviewPage />
        </ProtectedRoute>
      } />
      <Route path="buyers/:userId/review" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <BuyerReviewPage />
        </ProtectedRoute>
      } />
      <Route path="add-gender" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer']}>
          <AddGenderPage />
        </ProtectedRoute>
      } />
      <Route path="store" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer']}>
          <StorePage />
        </ProtectedRoute>
      } />
      <Route path="sellers" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer']}>
          <SellersListPage />
        </ProtectedRoute>
      } />
      <Route path="add-categories" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'buyer']}>
          <AddCategoriesPage />
        </ProtectedRoute>
      } />
      <Route path="add-tags" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AddTagsPage />
        </ProtectedRoute>
      } />
      <Route path="add-traits" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AddTraitsPage />
        </ProtectedRoute>
      } />
      <Route path="add-diet" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AddDietPage />
        </ProtectedRoute>
      } />
      <Route path="add-maturity" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AddMaturityPage />
        </ProtectedRoute>
      } />
      <Route path="add-origin" element={
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AddOriginPage />
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
    </Route>
  </Routes>
);

export default AdminRoutes;