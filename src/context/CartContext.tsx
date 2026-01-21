// // import { createContext, useContext, useEffect, useState } from 'react';
// // import type { ReactNode } from 'react';
// // import type { Cart } from '../types/cart';

// // import {
// //   getCartByUser,
// //   addToCart,
// //   updateCartItem,
// //   removeFromCart,
// //   clearCart,
// // } from '../api/cart';

// // /* ======================
// //    1. CONTEXT TYPE
// // ====================== */
// // interface CartContextType {
// //   cart: Cart | null;
// //   loading: boolean;
// //   error: string | null;

// //   fetchCart: () => Promise<void>;
// //   addItem: (productId: number, quantity?: number) => Promise<void>;
// //   updateQuantity: (productId: number, quantity: number) => Promise<void>;
// //   removeItem: (productId: number) => Promise<void>;
// //   clearAll: () => Promise<void>;
// // }

// // /* ======================
// //    2. CREATE CONTEXT
// // ====================== */
// // const CartContext = createContext<CartContextType | undefined>(undefined);

// // interface CartProviderProps {
// //   children: ReactNode;
// // }

// // /* ======================
// //    3. PROVIDER
// // ====================== */
// // export const CartProvider = ({ children }: CartProviderProps) => {
// //   const [cart, setCart] = useState<Cart | null>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   /* ---------- FETCH CART ---------- */
// //   const fetchCart = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       // DummyJSON trả về carts[]
// //       const res = await getCartByUser();
// //       const userCart = res.carts[0] || null;

// //       setCart(userCart);
// //     } catch {
// //       setError('Failed to fetch cart');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------- ADD ITEM ---------- */
// //   const addItem = async (productId: number, quantity = 1) => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const updatedCart = await addToCart(productId, quantity);
// //       setCart(updatedCart);
// //       localStorage.setItem('cart', JSON.stringify(updatedCart));
// //     } catch {
// //       setError('Failed to add item to cart');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------- UPDATE QUANTITY ---------- */
// //   const updateQuantity = async (productId: number, quantity: number) => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const updatedCart = await updateCartItem(productId, quantity);
// //       setCart(updatedCart);
// //     } catch {
// //       setError('Failed to update quantity');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------- REMOVE ITEM ---------- */
// //   const removeItem = async (productId: number) => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const updatedCart = await removeFromCart(productId);
// //       setCart(updatedCart);
// //     } catch {
// //       setError('Failed to remove item');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------- CLEAR CART ---------- */
// //   const clearAll = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       await clearCart();
// //       setCart(null);
// //     } catch {
// //       setError('Failed to clear cart');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------- AUTO FETCH ON MOUNT ---------- */
// //   useEffect(() => {
// //     fetchCart();
// //   }, []);

// //   return (
// //     <CartContext.Provider
// //       value={{
// //         cart,
// //         loading,
// //         error,
// //         fetchCart,
// //         addItem,
// //         updateQuantity,
// //         removeItem,
// //         clearAll,
// //       }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // /* ======================
// //    4. CUSTOM HOOK
// // ====================== */
// // export const useCartContext = () => {
// //   const context = useContext(CartContext);
// //   if (context === undefined) {
// //     throw new Error('useCartContext must be used within CartProvider');
// //   }
// //   return context;
// // };
// import { createContext, useContext, useEffect, useState } from 'react';
// import type { ReactNode } from 'react';
// import type { Cart } from '../types/cart';

// import {
//   getCartByUser,
//   addToCart,
//   updateCartItem,
//   removeFromCart,
//   clearCart as clearCartApi,
// } from '../api/cart';

// /* ======================
//    1. CONTEXT TYPE
// ====================== */
// interface CartContextType {
//   cart: Cart | null;
//   loading: boolean;
//   error: string | null;

//   fetchCart: () => Promise<void>;
//   addItem: (productId: number, quantity?: number) => Promise<void>;
//   updateQuantity: (productId: number, quantity: number) => Promise<void>;
//   removeItem: (productId: number) => Promise<void>;
//   clearAll: () => Promise<void>;
// }

// /* ======================
//    2. CREATE CONTEXT
// ====================== */
// const CartContext = createContext<CartContextType | undefined>(undefined);

// interface CartProviderProps {
//   children: ReactNode;
// }

// /* ======================
//    3. PROVIDER
// ====================== */
// export const CartProvider = ({ children }: CartProviderProps) => {
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   /* ---------- FETCH CART ---------- */
//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // 1. Ưu tiên localStorage
//       const localCart = localStorage.getItem('cart');
//       if (localCart) {
//         setCart(JSON.parse(localCart));
//         return;
//       }

//       // 2. Chỉ fetch API nếu chưa có local
//       const res = await getCartByUser();
//       const userCart = res.carts[0] || null;

//       if (userCart) {
//         setCart(userCart);
//         localStorage.setItem('cart', JSON.stringify(userCart));
//       }
//     } catch {
//       setError('Failed to fetch cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- ADD ITEM ---------- */
//   const addItem = async (productId: number, quantity = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const updatedCart = await addToCart(productId, quantity);

//       setCart(updatedCart);
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//     } catch {
//       setError('Failed to add item to cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- UPDATE QUANTITY ---------- */
//   const updateQuantity = async (productId: number, quantity: number) => {
//     if (quantity <= 0) {
//       await removeItem(productId);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const updatedCart = await updateCartItem(productId, quantity);

//       setCart(updatedCart);
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//     } catch {
//       setError('Failed to update quantity');
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- REMOVE ITEM ---------- */
//   const removeItem = async (productId: number) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const updatedCart = await removeFromCart(productId);

//       setCart(updatedCart);
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//     } catch {
//       setError('Failed to remove item');
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- CLEAR CART ---------- */
//   const clearAll = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       await clearCartApi();

//       setCart(null);
//       localStorage.removeItem('cart');
//     } catch {
//       setError('Failed to clear cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- AUTO FETCH ON APP LOAD ---------- */
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         loading,
//         error,
//         fetchCart,
//         addItem,
//         updateQuantity,
//         removeItem,
//         clearAll,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// /* ======================
//    4. CUSTOM HOOK
// ====================== */
// export const useCartContext = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCartContext must be used within CartProvider');
//   }
//   return context;
// };
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Cart } from "../types/cart";

import {
  getCartByUser,
  addToCartApi,
  updateCartApi,
  deleteCartApi,
  getLocalCart,
  saveLocalCart,
  clearLocalCart,
  mergeCartItem,
  updateItemQuantity,
  removeCartItem,
  // recalculateCart,
} from "../api/cart";

/* ======================
   1. CONTEXT TYPE
====================== */
interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearAll: () => Promise<void>;
}

/* ======================
   2. CREATE CONTEXT
====================== */
const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

/* ======================
   3. PROVIDER
====================== */
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- HELPER: Update cart state + localStorage ---------- */
  const updateCart = (newCart: Cart | null) => {
    setCart(newCart);
    if (newCart) {
      saveLocalCart(newCart);
    } else {
      clearLocalCart();
    }
  };

  /* ---------- FETCH CART ---------- */
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Ưu tiên localStorage
      const localCart = getLocalCart();
      if (localCart) {
        setCart(localCart);
        return;
      }

      // 2. Fetch từ API nếu chưa có local
      const res = await getCartByUser();
      const userCart = res.carts[0] || null;

      if (userCart) {
        updateCart(userCart);
      }
    } catch {
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ADD ITEM ---------- */
  const addItem = async (productId: number, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Gọi API để lấy thông tin product đầy đủ
      const apiResponse = await addToCartApi(productId, quantity);

      // 2. Lấy item info từ response
      const newItem = apiResponse.products[0];

      if (!newItem) {
        throw new Error("Product not found");
      }

      // 3. Merge với cart hiện tại (local)
      const mergedCart = mergeCartItem(cart, newItem, quantity);

      // 4. Update state + localStorage
      updateCart(mergedCart);
    } catch {
      setError("Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UPDATE QUANTITY ---------- */
  const updateQuantity = async (productId: number, quantity: number) => {
    if (!cart) return;

    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Gọi API (simulate)
      await updateCartApi([{ id: productId, quantity }]);

      // 2. Update locally
      const updatedCart = updateItemQuantity(cart, productId, quantity);

      // 3. Save
      updateCart(updatedCart);
    } catch {
      setError("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- REMOVE ITEM ---------- */
  const removeItem = async (productId: number) => {
    if (!cart) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Gọi API (simulate)
      await updateCartApi([{ id: productId, quantity: 0 }]);

      // 2. Remove locally
      const updatedCart = removeCartItem(cart, productId);

      // 3. Save (hoặc clear nếu empty)
      if (updatedCart.products.length === 0) {
        updateCart(null);
      } else {
        updateCart(updatedCart);
      }
    } catch {
      setError("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CLEAR CART ---------- */
  const clearAll = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Gọi API (simulate)
      await deleteCartApi();

      // 2. Clear local
      updateCart(null);
    } catch {
      setError("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- AUTO FETCH ON APP LOAD ---------- */
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
        clearAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ======================
   4. CUSTOM HOOK
====================== */
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
};
