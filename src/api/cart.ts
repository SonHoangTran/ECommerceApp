// // API service for cart
// import type { Cart } from "../types/cart";
// import { api } from "../utils/api";

// const USER_ID = 1; // demo user
// const CART_ID = 1; // demo cart

// export const getCartByUser =() =>{
//   return api.get<{carts: Cart[]}>(`/carts/user/${USER_ID}`);
// }

// export const getCartById = () => {
//   return api.get<Cart>(`/carts/${CART_ID}`);
// };

// export const addToCart = (productId: number, quantity: number) => {
//   return api.post<Cart>("/carts/add", {
//     userId: USER_ID,
//     products: [
//       {
//         id: productId,
//         quantity,
//       },
//     ],
//   });
// };


// export const updateCartItem = (
//   productId: number,
//   quantity: number
// ) => {
//   return api.put<Cart>(`/carts/${CART_ID}`, {
//     merge: true,
//     products: [
//       {
//         id: productId,
//         quantity,
//       },
//     ],
//   });
// };

// export const removeFromCart = (productId: number) => {
//   return api.put<Cart>(`/carts/${CART_ID}`, {
//     merge: true,
//     products: [
//       {
//         id: productId,
//         quantity: 0,
//       },
//     ],
//   });
// };

// export const clearCart = () => {
//   return api.delete<Cart>(`/carts/${CART_ID}`);
// };
// API service for cart
import type { Cart, CartItem } from "../types/cart";
import { api } from "../utils/api";

const USER_ID = 1; // demo user
const CART_ID = 1; // demo cart

/* ========== API CALLS ========== */

export const getCartByUser = () => {
  return api.get<{ carts: Cart[] }>(`/carts/user/${USER_ID}`);
};

export const getCartById = () => {
  return api.get<Cart>(`/carts/${CART_ID}`);
};

// Gọi API để lấy thông tin product (dùng khi add item mới)
export const addToCartApi = (productId: number, quantity: number) => {
  return api.post<Cart>("/carts/add", {
    userId: USER_ID,
    products: [{ id: productId, quantity }],
  });
};

export const updateCartApi = (products: { id: number; quantity: number }[]) => {
  return api.put<Cart>(`/carts/${CART_ID}`, {
    merge: true,
    products,
  });
};

export const deleteCartApi = () => {
  return api.delete<Cart>(`/carts/${CART_ID}`);
};

/* ========== LOCAL CART HELPERS ========== */

const CART_STORAGE_KEY = "cart";

export const getLocalCart = (): Cart | null => {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveLocalCart = (cart: Cart): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const clearLocalCart = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

/**
 * Tính toán lại totals cho cart
 */
export const recalculateCart = (cart: Cart): Cart => {
  const products = cart.products.filter((p) => p.quantity > 0);

  const total = products.reduce((sum, item) => sum + item.total, 0);
  const discountedTotal = products.reduce((sum, item) => {
    const discounted = item.total * (1 - item.discountPercentage / 100);
    return sum + discounted;
  }, 0);

  return {
    ...cart,
    products,
    total: Math.round(total * 100) / 100,
    discountedTotal: Math.round(discountedTotal * 100) / 100,
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, item) => sum + item.quantity, 0),
  };
};

/**
 * Merge item mới vào cart hiện tại
 */
export const mergeCartItem = (
  currentCart: Cart | null,
  newItem: CartItem,
  quantity: number
): Cart => {
  // Nếu chưa có cart, tạo mới
  if (!currentCart) {
    const newCart: Cart = {
      id: CART_ID,
      userId: USER_ID,
      products: [{ ...newItem, quantity, total: newItem.price * quantity }],
      total: 0,
      discountedTotal: 0,
      totalProducts: 0,
      totalQuantity: 0,
    };
    return recalculateCart(newCart);
  }

  // Tìm item trong cart
  const existingIndex = currentCart.products.findIndex(
    (p) => p.id === newItem.id
  );

  let updatedProducts: CartItem[];

  if (existingIndex >= 0) {
    // Item đã tồn tại → cộng thêm quantity
    updatedProducts = currentCart.products.map((item, index) => {
      if (index === existingIndex) {
        const newQuantity = item.quantity + quantity;
        return {
          ...item,
          quantity: newQuantity,
          total: item.price * newQuantity,
        };
      }
      return item;
    });
  } else {
    // Item mới → thêm vào cuối
    updatedProducts = [
      ...currentCart.products,
      { ...newItem, quantity, total: newItem.price * quantity },
    ];
  }

  return recalculateCart({
    ...currentCart,
    products: updatedProducts,
  });
};

/**
 * Update quantity của 1 item
 */
export const updateItemQuantity = (
  cart: Cart,
  productId: number,
  quantity: number
): Cart => {
  const updatedProducts = cart.products.map((item) => {
    if (item.id === productId) {
      return {
        ...item,
        quantity,
        total: item.price * quantity,
      };
    }
    return item;
  });

  return recalculateCart({
    ...cart,
    products: updatedProducts,
  });
};

/**
 * Remove item khỏi cart
 */
export const removeCartItem = (cart: Cart, productId: number): Cart => {
  const updatedProducts = cart.products.filter((item) => item.id !== productId);

  return recalculateCart({
    ...cart,
    products: updatedProducts,
  });
};
