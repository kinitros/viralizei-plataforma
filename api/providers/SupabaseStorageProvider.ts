import { StorageProvider, RedirectLink, generateId } from './StorageProvider.js';
import { getSupabaseClient, Database } from '../config/supabase.js';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseStorageProvider extends StorageProvider {
  private getClient(): SupabaseClient<Database> {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Supabase não configurado');
    }
    return client;
  }

  async getAllLinks(): Promise<RedirectLink[]> {
    const client = this.getClient();
    const { data, error } = await client
      .from('redirect_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar links no Supabase:', error);
      throw new Error('Erro ao buscar links');
    }

    return (data || []).map(this.mapFromDatabase);
  }

  async createLink(link: Omit<RedirectLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<RedirectLink> {
    const client = this.getClient();
    const id = generateId();
    const now = new Date().toISOString();

    const dbLink: Database['public']['Tables']['redirect_links']['Insert'] = {
      id,
      service_key: link.serviceKey,
      quantity: link.quantity || null,
      url: link.url,
      description: link.description || null,
      active: link.active,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await (client as any)
      .from('redirect_links')
      .insert(dbLink)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar link no Supabase:', error);
      throw new Error('Erro ao criar link');
    }

    return this.mapFromDatabase(data);
  }

  async updateLink(id: string, updates: Partial<RedirectLink>): Promise<RedirectLink | null> {
    const client = this.getClient();
    const now = new Date().toISOString();

    const dbUpdates: Database['public']['Tables']['redirect_links']['Update'] = {
      updated_at: now
    };

    if (updates.serviceKey !== undefined) dbUpdates.service_key = updates.serviceKey;
    if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity || null;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.description !== undefined) dbUpdates.description = updates.description || null;
    if (updates.active !== undefined) dbUpdates.active = updates.active;

    const { data, error } = await (client as any)
      .from('redirect_links')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Não encontrado
      }
      console.error('Erro ao atualizar link no Supabase:', error);
      throw new Error('Erro ao atualizar link');
    }

    return this.mapFromDatabase(data);
  }

  async deleteLink(id: string): Promise<RedirectLink | null> {
    const client = this.getClient();

    const { data, error } = await client
      .from('redirect_links')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Não encontrado
      }
      console.error('Erro ao deletar link no Supabase:', error);
      throw new Error('Erro ao deletar link');
    }

    return this.mapFromDatabase(data);
  }

  async findLink(serviceKey: string, quantity?: number): Promise<RedirectLink | null> {
    const client = this.getClient();

    // Buscar link específico primeiro (com quantidade)
    let query = client
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
        const { data: generalData, error: generalError } = await client
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
      if (error.code === 'PGRST116') {
        return null; // Não encontrado
      }
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