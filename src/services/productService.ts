import { Product } from '../types/product';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export class ProductService {
  async getProducts(filters?: {
    network?: string;
    service_type?: string; // frontend naming
    region?: string;
    is_active?: boolean;   // frontend naming
  }): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.network) params.append('network', filters.network);
      if (filters?.service_type) params.append('serviceType', filters.service_type);
      if (filters?.region) params.append('region', filters.region);
      if (filters?.is_active !== undefined) params.append('active', String(filters.is_active));

      const response = await fetch(`${API_BASE}/products?${params}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      
      const result = await response.json();
      return Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  async getProductByServiceKey(serviceKey: string): Promise<Product | null> {
    try {
      const params = new URLSearchParams({ serviceKey, active: 'true' });
      const response = await fetch(`${API_BASE}/products?${params}`);
      if (!response.ok) {
        return null;
      }
      const result = await response.json();
      const list: Product[] = Array.isArray(result) ? result : (result.data || []);
      return list[0] || null;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  }

  async validateProduct(serviceKey: string, quantity: number, price: number): Promise<{
    valid: boolean;
    product?: Product;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE}/products/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_key: serviceKey,
          quantity,
          price,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao validar produto:', error);
      return { valid: false, error: 'Erro ao validar produto' };
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  getDiscountedPrice(product: Product): number {
    if (product.discount_percentage && product.discount_percentage > 0) {
      return product.price;
    }
    return product.price;
  }

  getOriginalPrice(product: Product): number {
    return product.original_price || product.price;
  }

  hasDiscount(product: Product): boolean {
    return product.discount_percentage > 0;
  }
}

export const productService = new ProductService();
