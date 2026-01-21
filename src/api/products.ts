// src/api/products.ts

import { api } from '../utils/api';
import type { ProductsResponse, Product } from '../types/product';

export const getProducts = (
  skip: number,
  limit: number,
  search?: string
): Promise<ProductsResponse> => {
  if (search && search.trim() !== '') {
    return api.get<ProductsResponse>(
      `/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
    );
  }
  return api.get<ProductsResponse>(
    `/products?limit=${limit}&skip=${skip}`
  );
};

export const getProductById = (id: number): Promise<Product> => {
  return api.get<Product>(`/products/${id}`);
};
