import { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { productService } from '../services/productService';

interface UseProductsOptions {
  network?: string;
  service_type?: string;
  region?: string;
  is_active?: boolean;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(options?: UseProductsOptions): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(options);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(options)]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

interface UseProductByServiceKeyResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProductByServiceKey(serviceKey: string): UseProductByServiceKeyResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceKey) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductByServiceKey(serviceKey);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [serviceKey]);

  return {
    product,
    loading,
    error,
  };
}