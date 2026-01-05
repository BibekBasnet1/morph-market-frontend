import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Toaster } from "react-hot-toast";
import Loading from "./components/common/Loading";

// Lazy load route components
const AdminRoutes = lazy(() => import("./components/auth/AdminRoutes"));
const SellerRoutes = lazy(() => import("./components/auth/SellerRoutes"));
const BuyerRoutes = lazy(() => import("./components/auth/BuyerRoutes"));

// Lazy load components
const Index = lazy(() => import("./pages/index"));
const AllReptilesPage = lazy(() => import("./pages/all"));
const LoginPage = lazy(() => import("./pages/user/auth/login"));
const RegisterPage = lazy(() => import("./pages/user/auth/register"));
const VerifyOtpPage = lazy(() => import("./pages/user/auth/verifyOtp"));
const NotFound = lazy(() => import("./pages/not-found/notFound"));

const queryClient = new QueryClient();

// Create a separate component to use AuthContext
const AppRoutes = () => {
  const { roles } = useAuth();
  const isAdmin = roles?.includes('admin') || roles?.includes('superadmin');
  const isSeller = roles?.includes('seller');
  const isBuyer = roles?.includes('buyer');

  const publicMenu = [
    { path: "/", load: Index },
    { path: "/all", load: AllReptilesPage },
    { path: "/login", load: LoginPage },
    { path: "/register", load: RegisterPage },
    { path: "/verifyOtp", load: VerifyOtpPage },
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
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
          <AppRoutes />
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;