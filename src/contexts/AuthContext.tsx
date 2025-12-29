import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { RoleName, User, UserRole } from '../types';
import { hasPermission, isRoleHigherOrEqual } from '../lib/permissions';
import { json } from 'zod';

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

  // Login function receives the API response user and token
// const login = useCallback(async (userData: User, token: string) => {
//   setUser(userData);
//   setRoles(userData.roles.map(r => r.name as RoleName));
//   setToken({ accessToken: token });
//   setIsAuthenticated(true);
// }, []);
const login = useCallback(async (userData: User, token: string) => {
  setUser(userData);
  setRoles(userData.roles.map(r => r.name as RoleName));
  setToken({ accessToken: token });
  setIsAuthenticated(true);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: { accessToken: token } }));
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
