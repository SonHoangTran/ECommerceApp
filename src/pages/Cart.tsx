// import { useNavigate } from 'react-router-dom';
// import { useCartContext } from '../context/CartContext';

// export const Cart = () => {
//   const navigate = useNavigate();

//   const {
//     cart,
//     loading,
//     error,
//     updateQuantity,
//     removeItem,
//     clearAll,
//   } = useCartContext();

//   if (loading) return <p>Loading cart...</p>;
//   if (error) return <p>{error}</p>;
//   if (!cart || cart.products.length === 0)
//     return <p>Your cart is empty</p>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Your Cart</h1>

//       {cart.products.map((item) => (
//         <div
//           key={item.id}
//           style={{
//             display: 'flex',
//             gap: 16,
//             marginBottom: 16,
//             borderBottom: '1px solid #ddd',
//             paddingBottom: 16,
//           }}
//         >
//           <img src={item.thumbnail} width={80} />
//           <div style={{ flex: 1 }}>
//             <h4>{item.title}</h4>
//             <p>${item.price}</p>

//             <div>
//               <button
//                 disabled={loading || item.quantity <= 1}
//                 onClick={() =>
//                   updateQuantity(item.id, item.quantity - 1)
//                 }
//               >
//                 -
//               </button>

//               <span style={{ margin: '0 10px' }}>
//                 {item.quantity}
//               </span>

//               <button
//                 disabled={loading}
//                 onClick={() =>
//                   updateQuantity(item.id, item.quantity + 1)
//                 }
//               >
//                 +
//               </button>
//             </div>

//             <button
//               disabled={loading}
//               onClick={() => removeItem(item.id)}
//             >
//               Remove
//             </button>
//           </div>

//           <strong>${item.total.toFixed(2)}</strong>
//         </div>
//       ))}

//       <hr />

//       <p>Total products: {cart.totalProducts}</p>
//       <p>Total quantity: {cart.totalQuantity}</p>
//       <h3>Final total: ${cart.discountedTotal}</h3>

//       <button disabled={loading} onClick={clearAll}>
//         Clear Cart
//       </button>

//       <button
//         style={{ marginLeft: 12 }}
//         onClick={() => navigate('/checkout')}
//       >
//         Proceed to Checkout
//       </button>
//     </div>
//   );
// };
/**
 * Cart Page
 * 
 * Features:
 * - Hiển thị danh sách sản phẩm trong giỏ hàng
 * - Cập nhật số lượng (optimistic update - không loading)
 * - Xóa sản phẩm
 * - Tính tổng tiền
 * - Navigate đến checkout
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';

/* ========== STYLES ========== */

const styles = {
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: 20,
  },
  title: {
    marginBottom: 24,
    fontSize: 28,
    fontWeight: 600,
  },
  emptyCart: {
    textAlign: 'center' as const,
    padding: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: '#666',
    marginBottom: 20,
  },
  cartList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
  },
  cartItem: {
    display: 'flex',
    gap: 16,
    padding: 16,
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    objectFit: 'cover' as const,
    borderRadius: 8,
    flexShrink: 0,
    backgroundColor: '#f5f5f5',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0, // Để text truncate hoạt động
  },
  itemTitle: {
    margin: 0,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  itemPrice: {
    margin: 0,
    color: '#27ae60',
    fontWeight: 500,
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    border: '1px solid #ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  quantityValue: {
    minWidth: 40,
    textAlign: 'center' as const,
    fontSize: 16,
    fontWeight: 500,
  },
  itemTotal: {
    minWidth: 80,
    textAlign: 'right' as const,
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
  },
  removeButton: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  summary: {
    marginTop: 24,
    padding: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 12,
    fontSize: 16,
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTop: '2px solid #ddd',
    fontSize: 20,
    fontWeight: 600,
  },
  buttonGroup: {
    display: 'flex',
    gap: 12,
    marginTop: 24,
  },
  clearButton: {
    padding: '14px 24px',
    backgroundColor: '#fff',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
  },
  checkoutButton: {
    flex: 1,
    padding: '14px 24px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
  browseButton: {
    padding: '14px 24px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
  },
};

/* ========== COMPONENT ========== */

export const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    error,
    updateQuantity,
    removeItem,
    clearAll,
  } = useCartContext();

  // Track các item đang được cập nhật (để disable button)
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  // Track item đang xóa
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
  // Track clear all
  const [isClearing, setIsClearing] = useState(false);

  /**
   * Handle tăng số lượng
   * Optimistic update - không show loading toàn trang
   */
  const handleIncrease = async (productId: number, currentQuantity: number) => {
    // Đánh dấu item đang update
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      await updateQuantity(productId, currentQuantity + 1);
    } finally {
      // Bỏ đánh dấu
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  /**
   * Handle giảm số lượng
   */
  const handleDecrease = async (productId: number, currentQuantity: number) => {
    if (currentQuantity <= 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      await updateQuantity(productId, currentQuantity - 1);
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  /**
   * Handle xóa item
   */
  const handleRemove = async (productId: number) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    
    try {
      await removeItem(productId);
    } finally {
      setRemovingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  /**
   * Handle clear all
   */
  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }
    
    setIsClearing(true);
    
    try {
      await clearAll();
    } finally {
      setIsClearing(false);
    }
  };

  // ========== RENDER ==========

  // Initial loading
  if (loading && !cart) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Your Cart</h1>
        <Loading text="Loading cart..." />
      </div>
    );
  }

  // Error state
  if (error && !cart) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Your Cart</h1>
        <ErrorMessage error={error} variant="card" />
      </div>
    );
  }

  // Empty cart
  if (!cart || cart.products.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Your Cart</h1>
        <div style={styles.emptyCart}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2>Your cart is empty</h2>
          <p style={styles.emptyText}>
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            style={styles.browseButton}
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.total;
  const discount = cart.total - cart.discountedTotal;
  const total = cart.discountedTotal;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Cart ({cart.totalQuantity} items)</h1>

      {/* Error banner */}
      {error && (
        <div style={{ marginBottom: 20 }}>
          <ErrorMessage error={error} variant="banner" />
        </div>
      )}

      {/* Cart Items */}
      <div style={styles.cartList}>
        {cart.products.map((item) => {
          const isUpdating = updatingItems.has(item.id);
          const isRemoving = removingItems.has(item.id);
          
          return (
            <div
              key={item.id}
              style={{
                ...styles.cartItem,
                opacity: isRemoving ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* Product Image */}
              <img
                src={item.thumbnail}
                alt={item.title}
                style={styles.itemImage}
              />

              {/* Product Info */}
              <div style={styles.itemInfo}>
                <h3 style={styles.itemTitle}>{item.title}</h3>
                <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
                
                {/* Quantity Control */}
                <div style={{ marginTop: 12 }}>
                  <div style={styles.quantityControl}>
                    {/* Decrease Button */}
                    <button
                      style={{
                        ...styles.quantityButton,
                        ...(item.quantity <= 1 || isUpdating
                          ? styles.quantityButtonDisabled
                          : {}),
                      }}
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      disabled={item.quantity <= 1 || isUpdating}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    {/* Quantity Display */}
                    <span style={styles.quantityValue}>
                      {isUpdating ? (
                        <Loading size="small" />
                      ) : (
                        item.quantity
                      )}
                    </span>

                    {/* Increase Button */}
                    <button
                      style={{
                        ...styles.quantityButton,
                        ...(isUpdating ? styles.quantityButtonDisabled : {}),
                      }}
                      onClick={() => handleIncrease(item.id, item.quantity)}
                      disabled={isUpdating}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Item Total */}
              <div style={styles.itemTotal}>
                ${item.total.toFixed(2)}
              </div>

              {/* Remove Button */}
              <button
                style={{
                  ...styles.removeButton,
                  opacity: isRemoving ? 0.5 : 1,
                }}
                onClick={() => handleRemove(item.id)}
                disabled={isRemoving}
              >
                {isRemoving ? 'Removing...' : 'Remove'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div style={styles.summary}>
        <div style={styles.summaryRow}>
          <span>Subtotal ({cart.totalProducts} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div style={{ ...styles.summaryRow, color: '#27ae60' }}>
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div style={styles.summaryTotal}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.buttonGroup}>
        <button
          style={{
            ...styles.clearButton,
            opacity: isClearing ? 0.5 : 1,
          }}
          onClick={handleClearAll}
          disabled={isClearing}
        >
          {isClearing ? 'Clearing...' : 'Clear Cart'}
        </button>
        
        <button
          style={styles.checkoutButton}
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};
