import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/index";
import { LoginPage } from "./pages/user/auth/login";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/user/auth/dashboard";
import MainLayout from "./components/layout/MainLayout";
import { SidebarProvider } from "./contexts/SidebarContext";
import { RegisterPage } from "./pages/user/auth/register";
import VerifyOtpPage from "./pages/user/auth/verifyOtp";
import { Toaster } from "react-hot-toast";
import ProfilePage from "./pages/profile/profilePage";
import AllReptilesPage from "./pages/all";
import AddCategoriesPage from "./pages/addCategories/addCategories";
import NotFound from "./pages/not-found/notFound";
import SellersListPage from "./pages/user/auth/sellers";
import BuyersListPage from "./pages/user/auth/buyers";
import StorePage from "./pages/store/store";

const queryClient = new QueryClient();

const App = () => (
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
            <Routes>
              {/* Public marketplace */}
              <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/all" element={<AllReptilesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verifyOtp" element={<VerifyOtpPage />} />

              </Route>
              
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['superadmin', 'admin','buyer','seller']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  }  />
                      <Route path="/profile" element={
                    <ProtectedRoute allowedRoles={['superadmin', 'admin','buyer','seller']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }  />
                <Route 
                  path="/buyers" 
                  element={
                    <ProtectedRoute allowedRoles={['superadmin', 'admin','buyer']}>
                      <BuyersListPage />
                    </ProtectedRoute>
                  } 
                />
                  <Route 
                  path="/store" 
                  element={
                    <ProtectedRoute allowedRoles={['superadmin', 'admin','buyer']}>
                      <StorePage />
                    </ProtectedRoute>
                  } 
                />
                     <Route 
                  path="/sellers" 
                  element={
                    <ProtectedRoute allowedRoles={['superadmin', 'admin','buyer']}>
                      <SellersListPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-categories" 
                  element={
                    <ProtectedRoute allowedRoles={['superadmin', 'admin','buyer']}>
                      <AddCategoriesPage />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
        </SidebarProvider>

      </AuthProvider>
    {/* </UserProvider> */}
  </QueryClientProvider>
);

export default App;
