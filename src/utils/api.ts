// API base configuration using fetch API

import { storage } from './storage';

const BASE_URL = 'https://dummyjson.com';

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiException extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Core API request function using fetch API
 * Handles authentication, error handling, and JSON parsing
 */
const apiRequest = async <T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { requiresAuth = false, ...fetchOptions } = options;
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add JWT token if authentication is required
  if (requiresAuth) {
    const token = storage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    // Make API request
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Handle different HTTP status codes
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      
      // Try to parse error message from response
      try {
        const errorData = await response.json() as { message?: string };
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If JSON parsing fails, use default error message
      }

      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          storage.removeToken();
          storage.removeUser();
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          break;
      }

      throw new ApiException(errorMessage, response.status, response.statusText);
    }

    // Parse JSON response
    try {
      const data = await response.json() as T;
      return data;
    } catch (error) {
      throw new ApiException(
        'Failed to parse response as JSON',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    // Handle network errors and other fetch failures
    if (error instanceof ApiException) {
      throw error;
    }
    
    // Network error or other fetch errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiException(
        'Network error. Please check your internet connection.',
        0,
        'Network Error'
      );
    }
    
    // Re-throw if it's already an ApiException, otherwise wrap it
    throw new ApiException(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0,
      'Unknown Error'
    );
  }
};

/**
 * API helper functions
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, requiresAuth = false) =>
    apiRequest<T>(endpoint, { method: 'GET', requiresAuth }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: unknown, requiresAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: unknown, requiresAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, requiresAuth = false) =>
    apiRequest<T>(endpoint, { method: 'DELETE', requiresAuth }),
};

// Export ApiException for error handling in components
export { ApiException };
