import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import type { Product } from '../types';

export function useProducts(params?: { search?: string; category?: string; sort?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getProducts(params)
      .then((data: Product[]) => {
        setProducts(data);
        setError(null);
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.search, params?.category, params?.sort]);

  return { products, loading, error };
}
