/**
 * useApiError Hook
 * 
 * Mục đích:
 * - Quản lý error state cho API calls
 * - Tự động parse và handle errors
 * - Hỗ trợ retry functionality
 * - Tích hợp với AuthContext để handle unauthorized
 * 
 * @example
 * const { error, setError, clearError, handleError } = useApiError();
 * 
 * const fetchData = async () => {
 *   try {
 *     const data = await api.get('/products');
 *     return data;
 *   } catch (err) {
 *     handleError(err);
 *   }
 * };
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import {
  parseApiError,
  isUnauthorizedError,
  logError,
  type AppError,
} from '../utils/errorHandler';

/* ========== TYPES ========== */

interface UseApiErrorOptions {
  /** Tự động redirect khi gặp 401 */
  redirectOnUnauthorized?: boolean;
  /** Context để log error */
  context?: string;
}

interface UseApiErrorReturn {
  /** Current error state */
  error: AppError | null;
  /** Set error manually */
  setError: (error: AppError | null) => void;
  /** Clear error */
  clearError: () => void;
  /** Handle error from catch block */
  handleError: (error: unknown) => AppError;
  /** Check if there's an error */
  hasError: boolean;
}

/* ========== HOOK ========== */

export const useApiError = (
  options: UseApiErrorOptions = {}
): UseApiErrorReturn => {
  const { redirectOnUnauthorized = true, context } = options;
  
  // State
  const [error, setError] = useState<AppError | null>(null);
  
  // Hooks
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle error từ catch block
   * Parse error, set state, và xử lý special cases
   */
  const handleError = useCallback(
    (err: unknown): AppError => {
      // 1. Log error (development only)
      logError(err, context);

      // 2. Parse error
      const appError = parseApiError(err);

      // 3. Handle unauthorized error
      if (isUnauthorizedError(appError) && redirectOnUnauthorized) {
        logout();
        navigate('/login', { 
          state: { message: 'Your session has expired. Please log in again.' } 
        });
      }

      // 4. Set error state
      setError(appError);

      return appError;
    },
    [context, logout, navigate, redirectOnUnauthorized]
  );

  return {
    error,
    setError,
    clearError,
    handleError,
    hasError: error !== null,
  };
};

/* ========== ADDITIONAL HOOKS ========== */

/**
 * useAsyncOperation Hook
 * 
 * Kết hợp loading và error state cho async operations
 * 
 * @example
 * const { loading, error, execute } = useAsyncOperation();
 * 
 * const fetchProducts = () => execute(async () => {
 *   const data = await api.get('/products');
 *   setProducts(data);
 * });
 */
interface UseAsyncOperationReturn<T> {
  loading: boolean;
  error: AppError | null;
  execute: (operation: () => Promise<T>) => Promise<T | undefined>;
  clearError: () => void;
}

export const useAsyncOperation = <T = unknown>(
  options: UseApiErrorOptions = {}
): UseAsyncOperationReturn<T> => {
  const [loading, setLoading] = useState(false);
  const { error,  clearError, handleError } = useApiError(options);

  const execute = useCallback(
    async (operation: () => Promise<T>): Promise<T | undefined> => {
      try {
        // Clear previous error
        clearError();
        
        // Start loading
        setLoading(true);

        // Execute operation
        const result = await operation();

        return result;
      } catch (err) {
        handleError(err);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [clearError, handleError]
  );

  return {
    loading,
    error,
    execute,
    clearError,
  };
};
