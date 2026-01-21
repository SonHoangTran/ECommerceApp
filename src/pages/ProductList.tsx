import { useEffect, useState, useCallback } from 'react';
import { getProducts } from '../api/products';
import type { Product } from '../types/product';
import { ProductCard } from '../components/product/ProductCard';

const LIMIT = 20;

export const ProductList = () => {
  // ======================
  // 1. STATE
  // ======================
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [skip, setSkip] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // ======================
  // 2. FETCH PRODUCTS
  // ======================
  const fetchProducts = useCallback(async () => {
    if (!hasMore) return;

    try {
      setError(null);

      page === 0 ? setLoading(true) : setIsFetchingMore(true);

      const response = await getProducts(page * LIMIT, LIMIT);

      setProducts((prev) => [...prev, ...response.products]);

      // DummyJSON trả total
      const loadedCount = (page + 1) * LIMIT;
      if (loadedCount >= response.total) {
        setHasMore(false);
      }

      setPage((prev) => prev + 1);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [page, hasMore]);

  // ======================
  // 3. FIRST LOAD (MOUNT)
  // ======================
  useEffect(() => {
    fetchProducts();
  }, []);

  // ======================
  // 4. SCROLL LISTENER
  // ======================
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (
        scrollTop + windowHeight >= fullHeight - 100 &&
        !isFetchingMore &&
        hasMore
      ) {
        fetchProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchProducts, isFetchingMore, hasMore]);

  // ======================
  // 5. RENDER STATES
  // ======================
  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // ======================
  // 6. RENDER UI
  // ======================
  return (
    <div style={{ padding: 20 }}>
      <h1>Product List</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {isFetchingMore && <p style={{ textAlign: 'center' }}>Loading more...</p>}
      {!hasMore && (
        <p style={{ textAlign: 'center' }}>No more products</p>
      )}
    </div>
  );
};
