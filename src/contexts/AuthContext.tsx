import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { hasPermission, isRoleHigherOrEqual } from '../lib/permissions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isRoleHigherOrEqual: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const MOCK_USERS: Record<string, User> = {
  'superadmin@demo.com': {
    id: '1',
    email: 'superadmin@demo.com',
    name: 'Super Admin',
    role: 'superadmin',
    createdAt: '2024-01-01',
    status: 'active',
  },
  'admin@demo.com': {
    id: '2',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-15',
    status: 'active',
  },
  'seller@demo.com': {
    id: '3',
    email: 'seller@demo.com',
    name: 'Seller User',
    role: 'seller',
    createdAt: '2024-02-01',
    status: 'active',
  },
};

const STORAGE_KEY = 'auth-storage';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted auth state on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { user: storedUser, isAuthenticated: storedAuth } = JSON.parse(stored);
        if (storedUser && storedAuth) {
          setUser(storedUser);
          setIsAuthenticated(storedAuth);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist auth state on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, isAuthenticated }));
    }
  }, [user, isAuthenticated, isLoading]);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS[email.toLowerCase()];
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const checkPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }, [user]);

  const checkRoleHigherOrEqual = useCallback((requiredRole: UserRole): boolean => {
    if (!user) return false;
    return isRoleHigherOrEqual(user.role, requiredRole);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
