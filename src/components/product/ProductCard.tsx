import type { Product } from '../../types/product';

interface Props {
  product: Product;
  onAddToCart: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart }: Props) {
  return (
    <div className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.price}</p>

      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  );
}
