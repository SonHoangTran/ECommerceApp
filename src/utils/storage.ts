// localStorage helpers

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const CART_KEY = 'cart';

export const storage = {
  // Token management
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // User management
  getUser: (): unknown | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: unknown): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  // Cart management
  getCart: (): unknown | null => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : null;
  },

  setCart: (cart: unknown): void => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  removeCart: (): void => {
    localStorage.removeItem(CART_KEY);
  },

  // Clear all
  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(CART_KEY);
  },
};
