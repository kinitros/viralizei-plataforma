export interface Product {
  id: string;
  name: string;
  service_key: string;
  quantity: number;
  price: number;
  original_price: number;
  discount_percentage: number;
  network: string;
  service_type: string;
  region: string;
  description?: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  network?: string;
  service_type?: string;
  region?: string;
  is_active?: boolean;
}

export interface ProductValidationResult {
  valid: boolean;
  product?: Product;
  error?: string;
}