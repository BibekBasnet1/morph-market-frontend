
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
// import { UserProvider } from "./providers/UserProvider";
import VerifyOtpPage from "./pages/user/auth/verifyOtp";
import { Toaster } from "react-hot-toast";
import BuyersPage from "./pages/user/auth/buyers";
import SellersPage from "./pages/user/auth/sellers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <UserProvider> */}
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
                <Route 
                  path="/buyers" 
                  element={
                    <ProtectedRoute allowedRoles={['superadmin', 'admin','buyer']}>
                      <BuyersPage />
                    </ProtectedRoute>
                  } 
                />
                     <Route 
                  path="/sellers" 
                  element={
                    <ProtectedRoute allowedRoles={['superadmin', 'admin','buyer']}>
                      <SellersPage />
                    </ProtectedRoute>
                  } 
                />
                {/* <Route 
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
        </SidebarProvider>

      </AuthProvider>
    {/* </UserProvider> */}
  </QueryClientProvider>
);

export default App;