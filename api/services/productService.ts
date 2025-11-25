import { getSupabaseClient } from '../config/supabase';
import type { Database } from '../config/supabase';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductFilters {
  active?: boolean;
  network?: string;
  serviceType?: string;
  region?: string;
  serviceKey?: string;
}

export interface ProductValidation {
  valid: boolean;
  product?: Product;
  errors?: string[];
}

export class ProductService {
  private supabase = getSupabaseClient();

  // Listar produtos com filtros
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    if (!this.supabase) {
      throw new Error('Supabase não configurado');
    }

    let query = this.supabase
      .from('products')
      .select('*')
      .order('network', { ascending: true })
      .order('service_type', { ascending: true })
      .order('quantity', { ascending: true });

    if (filters.active !== undefined) {
      query = query.eq('is_active', filters.active);
    }
    if (filters.network) {
      query = query.eq('network', filters.network.toLowerCase());
    }
    if (filters.serviceType) {
      query = query.eq('service_type', filters.serviceType.toLowerCase());
    }
    if (filters.region) {
      query = query.eq('region', filters.region.toLowerCase());
    }
    if (filters.serviceKey) {
      query = query.eq('service_key', filters.serviceKey.toLowerCase());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Erro ao buscar produtos');
    }

    return data || [];
  }

  // Obter produto por ID
  async getProductById(id: string): Promise<Product | null> {
    if (!this.supabase) {
      throw new Error('Supabase não configurado');
    }

    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Produto não encontrado
      }
      console.error('Erro ao buscar produto:', error);
      throw new Error('Erro ao buscar produto');
    }

    return data;
  }

  // Obter produto por serviceKey
  async getProductByServiceKey(serviceKey: string): Promise<Product | null> {
    if (!this.supabase) {
      throw new Error('Supabase não configurado');
    }

    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('service_key', serviceKey.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Produto não encontrado
      }
      console.error('Erro ao buscar produto:', error);
      throw new Error('Erro ao buscar produto');
    }

    return data;
  }

  // Criar produto
  async createProduct(product: ProductInsert): Promise<Product> {
    if (!this.supabase) {
      throw new Error('Supabase não configurado');
    }

    // Gerar serviceKey se não existir
    if (!product.service_key) {
      product.service_key = `${product.network}-${product.service_type}-${product.quantity}-${product.region}`
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');
    }

    const { data, error } = await this.supabase
      .from('products')
      .insert(product as any)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Erro ao criar produto');
    }

    return data;
  }

  // Atualizar produto
  async updateProduct(id: string, product: ProductUpdate): Promise<Product> {
    if (!this.supabase) {
      throw new Error('Supabase não configurado');
    }

    console.log('[updateProduct] id:', id, 'payload:', product)
    const { data, error } = await this.supabase
      .from('products')
      .update(product as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      const msg = [error.code, error.message, (error as any).details, (error as any).hint].filter(Boolean).join('|')
      throw new Error(msg || 'Erro ao atualizar produto')
    }

    return data;
  }

  // Deletar produto
  async deleteProduct(id: string): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase não configurado');
    }

    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar produto:', error);
      throw new Error('Erro ao deletar produto');
    }
  }

  // Validar produto
  async validateProduct(serviceKey: string, quantity?: number, price?: number): Promise<ProductValidation> {
    try {
      const product = await this.getProductByServiceKey(serviceKey);

      if (!product) {
        return {
          valid: false,
          errors: ['Produto não encontrado ou inativo']
        };
      }

      const errors: string[] = [];

      // Validar quantidade
      if (quantity !== undefined && quantity !== product.quantity) {
        errors.push('Quantidade inválida');
      }

      // Validar preço (considerando desconto)
      const discountedPrice = this.calculateDiscountedPrice(product.price, product.discount_percentage);
      if (price !== undefined && Math.abs(price - discountedPrice) > 0.01) {
        errors.push('Preço inválido');
      }

      return {
        valid: errors.length === 0,
        product,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Erro ao validar produto:', error);
      return {
        valid: false,
        errors: ['Erro ao validar produto']
      };
    }
  }

  // Calcular preço com desconto
  private calculateDiscountedPrice(price: number, discountPercentage: number): number {
    if (discountPercentage > 0) {
      return price * (1 - discountPercentage / 100);
    }
    return price;
  }

  // Obter preço original
  getOriginalPrice(product: Product): number {
    return product.original_price || product.price;
  }

  // Obter preço com desconto
  getDiscountedPrice(product: Product): number {
    return this.calculateDiscountedPrice(product.price, product.discount_percentage);
  }
}

export default new ProductService();
