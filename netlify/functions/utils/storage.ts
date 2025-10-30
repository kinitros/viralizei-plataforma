// Storage implementation for Netlify Functions with Supabase integration
import { createClient } from '@supabase/supabase-js';

interface RedirectLink {
  id: string;
  serviceKey: string;
  quantity?: number;
  url: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StorageProvider {
  getAllLinks(): Promise<RedirectLink[]>;
  getLinkById(id: string): Promise<RedirectLink | null>;
  createLink(data: Omit<RedirectLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<RedirectLink>;
  updateLink(id: string, data: Partial<RedirectLink>): Promise<RedirectLink | null>;
  deleteLink(id: string): Promise<boolean>;
  findLinkByServiceKey(serviceKey: string): Promise<RedirectLink | null>;
  findLink(serviceKey: string, quantity?: number): Promise<RedirectLink | null>;
}

// Supabase storage provider for Netlify Functions
class SupabaseStorageProvider implements StorageProvider {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL e Service Role Key são obrigatórios');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getAllLinks(): Promise<RedirectLink[]> {
    const { data, error } = await this.supabase
      .from('redirect_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar links no Supabase:', error);
      throw new Error('Erro ao buscar links');
    }

    return (data || []).map(this.mapFromDatabase);
  }

  async getLinkById(id: string): Promise<RedirectLink | null> {
    const { data, error } = await this.supabase
      .from('redirect_links')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Erro ao buscar link por ID:', error);
      throw new Error('Erro ao buscar link');
    }

    return data ? this.mapFromDatabase(data) : null;
  }

  async createLink(data: Omit<RedirectLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<RedirectLink> {
    const now = new Date().toISOString();
    const dbLink = {
      service_key: data.serviceKey,
      quantity: data.quantity || null,
      url: data.url,
      description: data.description || null,
      active: data.active,
      created_at: now,
      updated_at: now
    };

    const { data: result, error } = await this.supabase
      .from('redirect_links')
      .insert(dbLink)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar link no Supabase:', error);
      throw new Error('Erro ao criar link');
    }

    return this.mapFromDatabase(result);
  }

  async updateLink(id: string, updates: Partial<RedirectLink>): Promise<RedirectLink | null> {
    const now = new Date().toISOString();
    const dbUpdates: any = { updated_at: now };

    if (updates.serviceKey !== undefined) dbUpdates.service_key = updates.serviceKey;
    if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity || null;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.description !== undefined) dbUpdates.description = updates.description || null;
    if (updates.active !== undefined) dbUpdates.active = updates.active;

    const { data, error } = await this.supabase
      .from('redirect_links')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Erro ao atualizar link no Supabase:', error);
      throw new Error('Erro ao atualizar link');
    }

    return data ? this.mapFromDatabase(data) : null;
  }

  async deleteLink(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('redirect_links')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar link no Supabase:', error);
      throw new Error('Erro ao deletar link');
    }

    return true;
  }

  async findLinkByServiceKey(serviceKey: string): Promise<RedirectLink | null> {
    const { data, error } = await this.supabase
      .from('redirect_links')
      .select('*')
      .eq('service_key', serviceKey)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Erro ao buscar link por service key:', error);
      throw new Error('Erro ao buscar link');
    }

    return data ? this.mapFromDatabase(data) : null;
  }

  async findLink(serviceKey: string, quantity?: number): Promise<RedirectLink | null> {
    // Buscar link específico primeiro (com quantidade)
    let query = this.supabase
      .from('redirect_links')
      .select('*')
      .eq('service_key', serviceKey)
      .eq('active', true);

    if (quantity !== undefined) {
      query = query.eq('quantity', quantity);
    } else {
      query = query.is('quantity', null);
    }

    let { data, error } = await query.single();

    if (error && error.code === 'PGRST116') {
      // Se não encontrou específico, buscar geral (sem quantidade)
      if (quantity !== undefined) {
        const { data: generalData, error: generalError } = await this.supabase
          .from('redirect_links')
          .select('*')
          .eq('service_key', serviceKey)
          .is('quantity', null)
          .eq('active', true)
          .single();

        if (generalError && generalError.code !== 'PGRST116') {
          console.error('Erro ao buscar link geral no Supabase:', generalError);
          throw new Error('Erro ao buscar link');
        }

        data = generalData;
        error = generalError;
      }
    }

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Erro ao buscar link no Supabase:', error);
      throw new Error('Erro ao buscar link');
    }

    return data ? this.mapFromDatabase(data) : null;
  }

  private mapFromDatabase(dbLink: any): RedirectLink {
    return {
      id: dbLink.id,
      serviceKey: dbLink.service_key,
      quantity: dbLink.quantity,
      url: dbLink.url,
      description: dbLink.description || '',
      active: dbLink.active,
      createdAt: dbLink.created_at,
      updatedAt: dbLink.updated_at
    };
  }
}

// Fallback memory storage for when Supabase is not available
class MemoryStorageProvider implements StorageProvider {
  private links: RedirectLink[] = [];

  async getAllLinks(): Promise<RedirectLink[]> {
    return [...this.links];
  }

  async getLinkById(id: string): Promise<RedirectLink | null> {
    return this.links.find(link => link.id === id) || null;
  }

  async createLink(data: Omit<RedirectLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<RedirectLink> {
    const now = new Date().toISOString();
    const newLink: RedirectLink = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now
    };
    this.links.push(newLink);
    return newLink;
  }

  async updateLink(id: string, data: Partial<RedirectLink>): Promise<RedirectLink | null> {
    const index = this.links.findIndex(link => link.id === id);
    if (index === -1) return null;
    
    this.links[index] = {
      ...this.links[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return this.links[index];
  }

  async deleteLink(id: string): Promise<boolean> {
    const index = this.links.findIndex(link => link.id === id);
    if (index === -1) return false;
    this.links.splice(index, 1);
    return true;
  }

  async findLinkByServiceKey(serviceKey: string): Promise<RedirectLink | null> {
    return this.links.find(link => link.serviceKey === serviceKey) || null;
  }

  async findLink(serviceKey: string, quantity?: number): Promise<RedirectLink | null> {
    return this.links.find(link => 
      link.serviceKey === serviceKey && 
      (quantity === undefined || link.quantity === quantity)
    ) || null;
  }
}

export class StorageProviderFactory {
  private static instance: StorageProvider | null = null;

  static getProvider(): StorageProvider {
    if (!this.instance) {
      try {
        // Tentar usar Supabase primeiro
        this.instance = new SupabaseStorageProvider();
        console.log('✅ Usando SupabaseStorageProvider nas Netlify Functions');
      } catch (error) {
        console.warn('⚠️ Supabase não configurado, usando MemoryStorageProvider como fallback');
        this.instance = new MemoryStorageProvider();
      }
    }
    return this.instance;
  }
}