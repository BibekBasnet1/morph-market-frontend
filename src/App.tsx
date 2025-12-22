
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/index";
import { LoginPage } from "./pages/login";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/dashboard";
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
          <Routes>
            {/* Public marketplace */}
            <Route path="/" element={<Index />} />
            <Route element={<MainLayout />}>

            <Route path="/login" element={<LoginPage />} />
            </Route>
            
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* <Route 
                path="/buyers" 
                element={
                  <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                    <BuyersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sellers" 
                element={
                  <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                    <SellersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute allowedRoles={['superadmin', 'admin', 'seller']}>
                    <OrdersPage />
                  </ProtectedRoute>
                } 
              /> */}
            </Route>
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
