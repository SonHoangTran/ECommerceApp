// import { useState, useEffect, useCallback } from 'react';
// import { useCartContext } from '../context/CartContext';
// import { getProducts } from '../api/products'; // Chỉ import getProducts
// import { 
//   Loading, 
//   ProductListSkeleton,
//   ErrorMessage 
// } from '../components/common';
// import { useApiError } from '../hooks/useApiError';
// import type { Product } from '../types/product';

// export const ProductList = () => {
//   // ========== STATE ==========
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [skip, setSkip] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedQuery, setDebouncedQuery] = useState('');
  
//   // Error handling hook
//   const { error, handleError, clearError } = useApiError({ 
//     context: 'ProductList' 
//   });
  
//   // Cart context
//   const { addItem } = useCartContext();

//   const LIMIT = 20;

//   /**
//    * Fetch products
//    * Sử dụng getProducts với param search (đã có sẵn trong API)
//    */
//   const fetchProducts = useCallback(async (isLoadMore = false) => {
//     try {
//       // Clear error on new fetch
//       clearError();
      
//       // Set appropriate loading state
//       if (isLoadMore) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       // Calculate skip value
//       const currentSkip = isLoadMore ? skip : 0;
      
//       // Fetch data - getProducts đã handle cả search và normal list
//       const response = await getProducts(
//         currentSkip, 
//         LIMIT, 
//         debouncedQuery || undefined // Truyền search query nếu có
//       );

//       // Update state
//       if (isLoadMore) {
//         setProducts(prev => [...prev, ...response.products]);
//       } else {
//         setProducts(response.products);
//       }

//       setSkip(currentSkip + LIMIT);
//       setHasMore(currentSkip + LIMIT < response.total);
//     } catch (err) {
//       handleError(err);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   }, [skip, debouncedQuery, clearError, handleError]);

//   /**
//    * Initial load và khi search query thay đổi
//    */
//   useEffect(() => {
//     setSkip(0);
//     setProducts([]); // Clear products khi search mới
//     fetchProducts(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [debouncedQuery]);

//   /**
//    * Debounce search query - 400ms delay
//    */
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedQuery(searchQuery);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   /**
//    * Infinite scroll handler
//    */
//   useEffect(() => {
//     const handleScroll = () => {
//       // Check if near bottom of page
//       const nearBottom = 
//         window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
      
//       if (nearBottom && !loadingMore && hasMore && !error && !loading) {
//         fetchProducts(true);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [loadingMore, hasMore, error, loading, fetchProducts]);

//   /**
//    * Retry handler - gọi lại fetch khi có lỗi
//    */
//   const handleRetry = () => {
//     setSkip(0);
//     fetchProducts(false);
//   };

//   // ========== RENDER ==========

//   // Initial loading - show skeleton
//   if (loading && products.length === 0) {
//     return (
//       <div>
//         <h1 style={{ padding: '20px 20px 0' }}>Products</h1>
//         {/* Search input vẫn hiển thị khi loading */}
//         <div style={{ padding: '0 20px 20px' }}>
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={{
//               width: '100%',
//               maxWidth: 400,
//               padding: '10px 16px',
//               border: '1px solid #ddd',
//               borderRadius: 8,
//               fontSize: 16,
//             }}
//           />
//         </div>
//         <ProductListSkeleton count={8} />
//       </div>
//     );
//   }

//   // Error state - show error message with retry
//   if (error && products.length === 0) {
//     return (
//       <div style={{ padding: 20 }}>
//         <h1>Products</h1>
//         <ErrorMessage
//           error={error}
//           variant="card"
//           onRetry={handleRetry}
//         />
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Products</h1>

//       {/* Search Input */}
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         style={{
//           width: '100%',
//           maxWidth: 400,
//           padding: '10px 16px',
//           marginBottom: 20,
//           border: '1px solid #ddd',
//           borderRadius: 8,
//           fontSize: 16,
//         }}
//       />

//       {/* Error banner (when there are products but load more failed) */}
//       {error && products.length > 0 && (
//         <div style={{ marginBottom: 20 }}>
//           <ErrorMessage
//             error={error}
//             variant="banner"
//             onRetry={handleRetry}
//             onDismiss={clearError}
//           />
//         </div>
//       )}

//       {/* Product Grid */}
//       <div
//   style={{
//     display: 'grid',
//     gridTemplateColumns: 'repeat(4, 1fr)', // 4 cột cố định
//     gap: 20,
//   }}
// >
//   {products.map((product) => (
//     <div
//       key={product.id}
//       style={{
//         border: '1px solid #e0e0e0',
//         borderRadius: 8,
//         padding: 16,
//         backgroundColor: '#fff',
//       }}
//     >
//       <img
//         src={product.thumbnail}
//         alt={product.title}
//         style={{
//           width: '100%',
//           height: 200,
//           objectFit: 'cover',
//           borderRadius: 4,
//         }}
//       />
//       {/* Title - 1 dòng, cắt nếu dài */}
//       <h3
//         style={{
//           margin: '12px 0 8px',
//           whiteSpace: 'nowrap',
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//         }}
//         title={product.title} // Hover để xem full title
//       >
//         {product.title}
//       </h3>
//       <p style={{ color: '#27ae60', fontWeight: 600 }}>
//         ${product.price.toFixed(2)}
//       </p>
//       <button
//         onClick={() => addItem(product.id)}
//         style={{
//           width: '100%',
//           padding: '10px 16px',
//           backgroundColor: '#3498db',
//           color: '#fff',
//           border: 'none',
//           borderRadius: 6,
//           cursor: 'pointer',
//         }}
//       >
//         Add to Cart
//       </button>
//     </div>
//   ))}
// </div>
      

//       {/* Loading more indicator */}
//       {loadingMore && (
//         <div style={{ marginTop: 20 }}>
//           <Loading text="Loading more products..." />
//         </div>
//       )}

//       {/* No more products */}
//       {!hasMore && products.length > 0 && (
//         <p style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>
//           No more products to load
//         </p>
//       )}

//       {/* Empty state - no products found */}
//       {!loading && products.length === 0 && !error && (
//         <div style={{ textAlign: 'center', padding: 40 }}>
//           <p style={{ color: '#666', fontSize: 18 }}>
//             {debouncedQuery 
//               ? `No products found for "${debouncedQuery}"` 
//               : 'No products available'}
//           </p>
//           {debouncedQuery && (
//             <button
//               onClick={() => setSearchQuery('')}
//               style={{
//                 marginTop: 12,
//                 padding: '8px 16px',
//                 backgroundColor: '#3498db',
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: 6,
//                 cursor: 'pointer',
//               }}
//             >
//               Clear Search
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
import { useState, useEffect, useCallback } from 'react';
import { useCartContext } from '../context/CartContext';
import { getProducts } from '../api/products';
import { 
  Loading, 
  ProductListSkeleton,
  ErrorMessage 
} from '../components/common';
import { useApiError } from '../hooks/useApiError';
import type { Product } from '../types/product';

/* ========== STYLES ========== */

const styles = {
  // Hero Banner
  heroBanner: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '60px 20px',
    textAlign: 'center' as const,
    color: '#fff',
    marginBottom: 40,
  },
  
  heroTitle: {
    fontSize: 42,
    fontWeight: 700,
    marginBottom: 16,
  },
  
  heroSubtitle: {
    fontSize: 18,
    opacity: 0.9,
    maxWidth: 600,
    margin: '0 auto',
  },

  // Container
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '0 20px 40px',
  },

  // Section Header
  sectionHeader: {
    textAlign: 'center' as const,
    marginBottom: 40,
  },
  
  sectionTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: '#333',
    marginBottom: 8,
  },
  
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
  },

  // Search Section
  searchSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 40,
  },
  
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: '4px 4px 4px 24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  
  searchInput: {
    flex: 1,
    padding: '14px 0',
    border: 'none',
    fontSize: 16,
    outline: 'none',
  },
  
  searchButton: {
    padding: '14px 32px',
    backgroundColor: '#ff6b35',
    color: '#fff',
    border: 'none',
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
  },

  // Product Grid
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 24,
  },

  // Product Card
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  
  productImageWrapper: {
    position: 'relative' as const,
    width: '100%',
    height: 220,
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
  },
  
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.3s ease',
  },
  
  productBadge: {
    position: 'absolute' as const,
    top: 12,
    left: 12,
    padding: '6px 12px',
    backgroundColor: '#ff6b35',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 20,
  },
  
  wishlistButton: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  
  productContent: {
    padding: 20,
  },
  
  productCategory: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 8,
  },
  
  productTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
    marginBottom: 12,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  
  productRating: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  
  stars: {
    color: '#ffc107',
    fontSize: 14,
  },
  
  ratingCount: {
    fontSize: 13,
    color: '#999',
  },
  
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  productPrice: {
    fontSize: 22,
    fontWeight: 700,
    color: '#ff6b35',
  },
  
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecoration: 'line-through',
    marginLeft: 8,
  },
  
  addToCartButton: {
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background-color 0.2s',
  },

  // Loading more
  loadingMore: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 0',
  },

  // Empty State
  emptyState: {
    textAlign: 'center' as const,
    padding: 60,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  
  emptyTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#333',
    marginBottom: 8,
  },
  
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  
  clearSearchButton: {
    padding: '12px 24px',
    backgroundColor: '#ff6b35',
    color: '#fff',
    border: 'none',
    borderRadius: 25,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
  },

  // End of list
  endOfList: {
    textAlign: 'center' as const,
    padding: '30px 0',
    color: '#999',
    fontSize: 14,
  },
};

/* ========== COMPONENT ========== */

export const ProductList = () => {
  // ========== STATE ==========
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const { error, handleError, clearError } = useApiError({ 
    context: 'ProductList' 
  });
  
  const { addItem } = useCartContext();

  const LIMIT = 20;

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    try {
      clearError();
      
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const currentSkip = isLoadMore ? skip : 0;
      
      const response = await getProducts(
        currentSkip, 
        LIMIT, 
        debouncedQuery || undefined
      );

      if (isLoadMore) {
        setProducts(prev => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }

      setSkip(currentSkip + LIMIT);
      setHasMore(currentSkip + LIMIT < response.total);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [skip, debouncedQuery, clearError, handleError]);

  useEffect(() => {
    setSkip(0);
    setProducts([]);
    fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = 
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
      
      if (nearBottom && !loadingMore && hasMore && !error && !loading) {
        fetchProducts(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, error, loading, fetchProducts]);

  const handleRetry = () => {
    setSkip(0);
    fetchProducts(false);
  };

  // Render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars ? '★' : '☆');
    }
    return stars.join('');
  };

  // ========== RENDER ==========

  if (loading && products.length === 0) {
    return (
      <div>
        {/* Hero Banner */}
        <div style={styles.heroBanner}>
          <h1 style={styles.heroTitle}>Discover Amazing Products</h1>
          <p style={styles.heroSubtitle}>
            Shop the latest trends with unbeatable prices and free shipping
          </p>
        </div>

        <div style={styles.container}>
          {/* Search */}
          <div style={styles.searchSection}>
            <div style={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <button style={styles.searchButton}>🔍 Search</button>
            </div>
          </div>

          {/* Section Header */}
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Best Products</h2>
            <p style={styles.sectionSubtitle}>
              Discover our handpicked selection of top-quality items
            </p>
          </div>

          <ProductListSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div style={styles.container}>
        <ErrorMessage
          error={error}
          variant="card"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div style={styles.heroBanner}>
        <h1 style={styles.heroTitle}>Discover Amazing Products</h1>
        <p style={styles.heroSubtitle}>
          Shop the latest trends with unbeatable prices and free shipping
        </p>
      </div>

      <div style={styles.container}>
        {/* Search Section */}
        <div style={styles.searchSection}>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button style={styles.searchButton}>🔍 Search</button>
          </div>
        </div>

        {/* Section Header */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Best Products</h2>
          <p style={styles.sectionSubtitle}>
            Discover our handpicked selection of top-quality items
          </p>
        </div>

        {/* Error Banner */}
        {error && products.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <ErrorMessage
              error={error}
              variant="banner"
              onRetry={handleRetry}
              onDismiss={clearError}
            />
          </div>
        )}

        {/* Product Grid */}
        <div style={styles.productGrid}>
          {products.map((product) => (
            <div
              key={product.id}
              style={styles.productCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
              }}
            >
              {/* Image */}
              <div style={styles.productImageWrapper}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={styles.productImage}
                />
                {product.discountPercentage > 10 && (
                  <span style={styles.productBadge}>
                    -{Math.round(product.discountPercentage)}%
                  </span>
                )}
                <button style={styles.wishlistButton}>♡</button>
              </div>

              {/* Content */}
              <div style={styles.productContent}>
                <p style={styles.productCategory}>{product.category}</p>
                <h3 style={styles.productTitle} title={product.title}>
                  {product.title}
                </h3>
                
                {/* Rating */}
                <div style={styles.productRating}>
                  <span style={styles.stars}>{renderStars(product.rating)}</span>
                  <span style={styles.ratingCount}>({product.rating.toFixed(1)})</span>
                </div>

                {/* Price */}
                <div style={styles.priceRow}>
                  <div>
                    <span style={styles.productPrice}>
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span style={styles.originalPrice}>
                        ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => addItem(product.id)}
                  style={styles.addToCartButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff6b35';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#333';
                  }}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loading More */}
        {loadingMore && (
          <div style={styles.loadingMore}>
            <Loading text="Loading more products..." />
          </div>
        )}

        {/* End of List */}
        {!hasMore && products.length > 0 && (
          <p style={styles.endOfList}>
            ✨ You've seen all products ✨
          </p>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && !error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No Products Found</h3>
            <p style={styles.emptyText}>
              {debouncedQuery 
                ? `We couldn't find any products matching "${debouncedQuery}"` 
                : 'No products available at the moment'}
            </p>
            {debouncedQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
