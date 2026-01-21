// src/components/product/ProductCard.tsx

import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12 }}>
      <img
        src={product.thumbnail}
        alt={product.title}
        width={150}
      />

      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <p>⭐ {product.rating}</p>

      <button onClick={() => onAddToCart?.(product)}>
        Add to cart
      </button>
    </div>
  );
};
