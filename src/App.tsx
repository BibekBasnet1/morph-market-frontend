import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Toaster } from "react-hot-toast";
import Loading from "./components/common/Loading";
import QuickNav from "./components/common/QuickNav";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const AdminRoutes = lazy(() => import("./components/auth/AdminRoutes"));
const SellerRoutes = lazy(() => import("./components/auth/SellerRoutes"));
const BuyerRoutes = lazy(() => import("./components/auth/BuyerRoutes"));

const Index = lazy(() => import("./pages/index"));
const AllReptilesPage = lazy(() => import("./pages/marketplace"));
const LoginPage = lazy(() => import("./pages/user/auth/login"));
const RegisterPage = lazy(() => import("./pages/user/auth/register"));
const VerifyOtpPage = lazy(() => import("./pages/user/auth/verifyOtp"));
const NotFound = lazy(() => import("./pages/not-found/notFound"));
const ProductDetail = lazy(() => import("./pages/products/ProductDetail"));
const CartPage = lazy(()=> import("./pages/cart/cart"))
const ActivityLogPage = lazy(() => import("./pages/activityLog/activityLog"));
const ProductDetailsImmersive = lazy(() => import("./pages/products/ProductDetailsImmersive"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, 
      staleTime: 0, 
      // staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 0, 
    },
  },
});

const AppRoutes = () => {
  const { roles } = useAuth();
  const isAdmin = roles?.includes('admin') || roles?.includes('superadmin');
  const isSeller = roles?.includes('seller');
  const isBuyer = roles?.includes('buyer');


  const publicMenu = [
    { path: "/", load: Index },
    { path: "/marketplace", load: AllReptilesPage },
    { path: "/product/:slug", load: ProductDetail },
    { path: "/login", load: LoginPage },
    { path: "/register", load: RegisterPage },
    { path: "/verifyOtp", load: VerifyOtpPage },
    { path: "/cart", load: CartPage },
    { path: "/activity-log", load: ActivityLogPage },
    { path: "/products/:slug/details", load: ProductDetailsImmersive },
  ];


  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {publicMenu.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<Loading />}>
                <MainLayout>
                  <route.load />
                </MainLayout>
              </Suspense>
            }
          />
        ))}

        {isAdmin && (
          <Route 
            path="/*" 
            element={
              <Suspense fallback={<Loading />}>
                <AdminRoutes />
              </Suspense>
            } 
          />
        )}
        {isSeller && (
          <Route 
            path="/*" 
            element={
              <Suspense fallback={<Loading />}>
                <SellerRoutes />
              </Suspense>
            } 
          />
        )}
        {isBuyer && (
          <Route 
            path="/*" 
            element={
              <Suspense fallback={<Loading />}>
                <BuyerRoutes />
              </Suspense>
            } 
          />
        )}
        <Route 
          path="*" 
          element={
            <Suspense fallback={<Loading />}>
              <NotFound />
            </Suspense>
          } 
        />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <QuickNav />
          <Toaster
            position="top-center"
            containerStyle={{
              top: 80,
              left: 20,
              right: 20,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                padding: '16px 20px',
                color: '#1a202c',
                background: '#ffffff',
                fontWeight: 500,
                fontSize: '14px',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                maxWidth: '500px',
              },
              success: {
                style: {
                  background: '#10b981',
                  color: '#ffffff',
                  border: '1px solid #059669',
                },
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: '#ffffff',
                  border: '1px solid #dc2626',
                },
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#ef4444',
                },
              },
              loading: {
                style: {
                  background: '#3b82f6',
                  color: '#ffffff',
                  border: '1px solid #2563eb',
                },
              },
            }}
            containerClassName="pointer-events-none"
          />
          <Elements stripe={stripePromise}> <AppRoutes /> </Elements>

        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;