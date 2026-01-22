import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { RoleName, User, UserRole } from '../types';
import { hasPermission, isRoleHigherOrEqual } from '../lib/permissions';
import type { Cart } from '../types/CartTypes';
import { CartService } from '../lib/api/cart';

interface AuthToken {
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
   roles: RoleName[]; // derived from user.roles
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isRoleHigherOrEqual: (requiredRole: RoleName) => boolean; 
  token: AuthToken | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'auth-storage';

const getLocalCarts = (): Cart[] => {
  try {
    return JSON.parse(localStorage.getItem("cart-products") || "[]");
  } catch {
    return [];
  }
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
const [roles, setRoles] = useState<RoleName[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<AuthToken | null>(null);

  // Load persisted auth state
useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.user && parsed.token) {

        console.log("aaaaaaa", parsed)
        setUser(parsed.user);
        setRoles(parsed.user.roles.map((r: UserRole) => r.name));
        setToken(parsed.token);
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } 
  }
  setIsLoading(false);
}, []);

  // Persist auth state on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    }
  }, [user, token, isLoading]);


// const login = useCallback(async (userData: User, token: string) => {
//   setUser(userData);
//   setRoles(userData.roles.map(r => r.name as RoleName));
//   setToken({ accessToken: token });
//   setIsAuthenticated(true);
//   localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: { accessToken: token } }));
// }, []);

const login = useCallback(async (userData: User, token: string) => {
  // 1️⃣ Set auth state
  setUser(userData);
  setRoles(userData.roles.map(r => r.name as RoleName));
  setToken({ accessToken: token });
  setIsAuthenticated(true);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user: userData,
      token: { accessToken: token },
    })
  );

  // 2️⃣ Merge local carts → API carts
  const localCarts = getLocalCarts();
  if (!localCarts.length) return;

  try {
    for (const item of localCarts) {
      await CartService.create({
        product_id: item.product_id,
        store_id: item.store_id!,
        quantity: item.quantity,
      });
    }

    // 3️⃣ Clear local carts ONLY after success
    localStorage.removeItem("cart-products");
  } catch (error) {
    console.error("Failed to sync local carts", error);
    // ❗ Do NOT clear localStorage so we can retry later
  }
}, []);



  // Logout clears state
  const logout = useCallback(() => {
    setUser(null);
    setRoles([]);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Check permission for the user

const checkPermission = useCallback(
  (permission: string) => hasPermission(roles, permission),
  [roles]
);




const checkRoleHigherOrEqual = useCallback(
  (requiredRole: RoleName) =>
    isRoleHigherOrEqual(roles, requiredRole),
  [roles]
);


  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasPermission: checkPermission,
        isRoleHigherOrEqual: checkRoleHigherOrEqual,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
