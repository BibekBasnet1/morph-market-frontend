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
import { normalizeUser } from '../lib/normalizeUser';

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
          const normalized = normalizeUser(parsed.user);
          // token in storage might be object { accessToken } or raw string
          const storedToken =
            typeof parsed.token === 'string'
              ? { accessToken: parsed.token.replace(/^Bearer\s+/i, '') }
              : parsed.token?.accessToken
              ? parsed.token
              : { accessToken: parsed.token };

          setUser(normalized);
          setRoles(normalized.roles.map((r: UserRole) => r.name as RoleName));
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);


const login = useCallback(async (userData: any, token: string) => {
  const normalized = normalizeUser(userData);
  setUser(normalized);
  setRoles(normalized.roles.map((r) => r.name as RoleName));
  // strip any 'Bearer ' prefix we might receive from API
  const raw = typeof token === 'string' ? token.replace(/^Bearer\s+/i, '') : token;
  setToken({ accessToken: raw });
  setIsAuthenticated(true);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user: normalized,
      token: { accessToken: raw },
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
