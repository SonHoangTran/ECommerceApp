// API service for authentication

import { api } from '../utils/api';
import { storage } from '../utils/storage';
import type { LoginRequest, LoginResponse, User } from '../types/auth';

/**
 * Login user with username and password
 * POST /auth/login
 * Saves token and user info to localStorage
 * @returns User info from LoginResponse
 */
export const login = async (username: string, password: string): Promise<User> => {
  const loginData: LoginRequest = { username, password };
  
  // Call DummyJSON login API
  const response = await api.post<LoginResponse>('/auth/login', loginData);
  
  // Save token to localStorage
  storage.setToken(response.accessToken);
  
  // Save user info to localStorage
  const user: User = {
    id: response.id,
    username: response.username,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    gender: response.gender,
    image: response.image,
  };
  storage.setUser(user);
  
  return user;
};

/**
 * Logout user
 * Removes token and user info from localStorage
 */
export const logout = (): void => {
  storage.removeToken();
  storage.removeUser();
};

/**
 * Get current user from localStorage
 * Since DummyJSON doesn't have /auth/me endpoint, we use stored user data
 * @returns User object or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  const user = storage.getUser();
  
  if (!user) {
    return null;
  }
  
  // Validate that we have a token
  const token = storage.getToken();
  if (!token) {
    return null;
  }
  
  return user as User;
};

/**
 * Check if user is authenticated
 * @returns true if token exists in localStorage
 */
export const isAuthenticated = (): boolean => {
  return !!storage.getToken();
};
