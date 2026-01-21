// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthContext } from '../../context/AuthContext';
// import { useCartContext } from '../../context/CartContext';

// export const Header = () => {
//   const navigate = useNavigate();

//   const { isAuthenticated, user, logout } = useAuthContext();
//   const { cart } = useCartContext();

//   const cartCount = cart?.totalQuantity ?? 0;

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <header
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '12px 20px',
//         borderBottom: '1px solid #ddd',
//       }}
//     >
//       {/* LEFT */}
//       <Link to="/products" style={{ fontWeight: 'bold' }}>
//         MyShop
//       </Link>

//       {/* RIGHT */}
//       <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
//         {/* CART */}
//         <div
//           style={{ position: 'relative', cursor: 'pointer' }}
//           onClick={() => navigate('/cart')}
//         >
//           🛒
//           {cartCount > 0 && (
//             <span
//               style={{
//                 position: 'absolute',
//                 top: -8,
//                 right: -10,
//                 background: 'red',
//                 color: 'white',
//                 borderRadius: '50%',
//                 fontSize: 12,
//                 padding: '2px 6px',
//               }}
//             >
//               {cartCount}
//             </span>
//           )}
//         </div>

//         {/* AUTH */}
//         {isAuthenticated ? (
//           <>
//             <span>Hello, {user?.firstName}</span>
//             <button onClick={handleLogout}>Logout</button>
//           </>
//         ) : (
//           <Link to="/login">Login</Link>
//         )}
//       </div>
//     </header>
//   );
// };
/**
 * Header Component - E-commerce Style
 * 
 * Features:
 * - Logo và navigation
 * - Search bar
 * - Cart icon với badge
 * - User menu
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useCartContext } from '../../context/CartContext';

/* ========== STYLES ========== */

const styles = {
  // Top bar (optional - for promotions)
  topBar: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '8px 0',
    fontSize: 13,
    textAlign: 'center' as const,
  },
  
  // Main header
  header: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
  },
  
  headerInner: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
  },
  
  // Logo
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 22,
    fontWeight: 700,
    color: '#333',
  },
  
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 20,
  },
  
  // Navigation
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  
  navLink: {
    padding: '10px 20px',
    borderRadius: 25,
    fontSize: 15,
    fontWeight: 500,
    color: '#555',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  
  navLinkActive: {
    backgroundColor: '#ff6b35',
    color: '#fff',
  },
  
  // Search bar
  searchContainer: {
    flex: 1,
    maxWidth: 500,
    margin: '0 40px',
  },
  
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: '0 20px',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  
  searchInput: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    background: 'transparent',
    fontSize: 15,
    outline: 'none',
  },
  
  searchIcon: {
    color: '#999',
    fontSize: 18,
  },
  
  // Right section
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  
  // Cart button
  cartButton: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: 25,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  cartIcon: {
    fontSize: 20,
  },
  
  cartBadge: {
    position: 'absolute' as const,
    top: -5,
    right: -5,
    backgroundColor: '#ff6b35',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // User section
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 24px',
    backgroundColor: '#ff6b35',
    color: '#fff',
    border: 'none',
    borderRadius: 25,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#ff6b35',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 16,
  },
  
  userName: {
    fontSize: 14,
    fontWeight: 500,
  },
  
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: 20,
    fontSize: 13,
    cursor: 'pointer',
  },
};

/* ========== COMPONENT ========== */

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthContext();
  const { cart } = useCartContext();

  const cartItemCount = cart?.totalQuantity || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Promotion Bar */}
      <div style={styles.topBar}>
        🎉 Free Shipping on Orders Over $50 | Use Code: <strong>WELCOME10</strong> for 10% Off
      </div>

      {/* Main Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* Logo */}
          <Link to="/products" style={styles.logo}>
            <div style={styles.logoIcon}>🛒</div>
            <span>ShopMart</span>
          </Link>

          {/* Navigation */}
          <nav style={styles.nav}>
            <Link
              to="/products"
              style={{
                ...styles.navLink,
                ...(isActive('/products') ? styles.navLinkActive : {}),
              }}
            >
              Home
            </Link>
            <span style={styles.navLink}>Category ▾</span>
            <span style={styles.navLink}>Shop</span>
            <span style={styles.navLink}>Blog</span>
            <span style={styles.navLink}>About</span>
          </nav>

          {/* Right Section */}
          <div style={styles.rightSection}>
            {/* Cart Button */}
            <button
              style={styles.cartButton}
              onClick={() => navigate('/cart')}
            >
              <span style={styles.cartIcon}>🛒</span>
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span style={styles.cartBadge}>{cartItemCount}</span>
              )}
            </button>

            {/* User Section */}
            {isAuthenticated && user ? (
              <div style={styles.userSection}>
                <div style={styles.userAvatar}>
                  {user.firstName?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={styles.userName}>
                    {user.firstName} {user.lastName}
                  </div>
                  <button style={styles.logoutButton} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                style={styles.loginButton}
                onClick={() => navigate('/login')}
              >
                <span>👤</span>
                Login
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
