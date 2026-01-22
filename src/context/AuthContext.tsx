import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '../api/auth';
import type { User } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Check authentication status from localStorage
   */
  const checkAuth = useCallback(() => {
    const currentUser = authApi.getCurrentUser();
    const currentToken = authApi.isAuthenticated() ? localStorage.getItem('token') : null;
    
    if (currentUser && currentToken) {
      setIsAuthenticated(true);
      setUser(currentUser);
      setToken(currentToken);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (username: string, password: string) => {
    try {
      const userData = await authApi.login(username, password);
      const tokenData = localStorage.getItem('token');
      
      setIsAuthenticated(true);
      setUser(userData);
      setToken(tokenData);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
      // 1. Clear auth via API
      authApi.logout();
    
      // 2. Reset auth state
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      
      // 3. Clear cart localStorage
      localStorage.removeItem('cart');
      
      // 4. Dispatch event để CartContext reset state
      window.dispatchEvent(new Event('auth-logout'));

    
  }, []);

  /**
   * Check authentication on mount
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
