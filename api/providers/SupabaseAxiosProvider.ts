import { StorageProvider, RedirectLink, generateId } from './StorageProvider.js';
import axios from 'axios';
import crypto from 'crypto';

export class SupabaseAxiosProvider extends StorageProvider {
  private supabaseUrl = 'https://hegbxjevmcjoawdbxjll.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZ2J4amV2bWNqb2F3ZGJ4amxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTgyNTk2NSwiZXhwIjoyMDc3NDAxOTY1fQ.-0cXgphROg1SkXxTwfcklqiviuxTZXnnPUNct2NwPz0';

  private getConfig() {
    const url = this.supabaseUrl;
    const key = this.supabaseKey;
    
    if (!url || !key) {
      throw new Error('Supabase não configurado: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes');
    }
    
    return {
      baseURL: `${url}/rest/v1`,
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getAllLinks(): Promise<RedirectLink[]> {
    try {
      const config = this.getConfig();
      const response = await axios.get('/redirect_links?select=*&order=created_at.desc', config);
      return (response.data || []).map(this.mapFromDatabase);
    } catch (error: any) {
      console.error('Erro ao buscar links no Supabase:', error.response?.data || error.message);
      throw new Error('Erro ao buscar links');
    }
  }

  async createLink(link: Omit<RedirectLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<RedirectLink> {
    try {
      const config = this.getConfig();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      const dbLink = {
        id,
        service_key: link.serviceKey,
        quantity: link.quantity || null,
        url: link.url,
        description: link.description || null,
        active: link.active,
        created_at: now,
        updated_at: now
      };

      const response = await axios.post('/redirect_links', dbLink, {
        ...config,
        headers: {
          ...config.headers,
          'Prefer': 'return=representation'
        }
      });

      return this.mapFromDatabase(response.data[0]);
    } catch (error: any) {
      console.error('Erro ao criar link no Supabase:', error.response?.data || error.message);
      throw new Error('Erro ao criar link');
    }
  }

  async updateLink(id: string, updates: Partial<RedirectLink>): Promise<RedirectLink | null> {
    try {
      const config = this.getConfig();
      const now = new Date().toISOString();

      const dbUpdates: any = {
        updated_at: now
      };

      if (updates.serviceKey !== undefined) dbUpdates.service_key = updates.serviceKey;
      if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity || null;
      if (updates.url !== undefined) dbUpdates.url = updates.url;
      if (updates.description !== undefined) dbUpdates.description = updates.description || null;
      if (updates.active !== undefined) dbUpdates.active = updates.active;

      const response = await axios.patch(`/redirect_links?id=eq.${id}`, dbUpdates, {
        ...config,
        headers: {
          ...config.headers,
          'Prefer': 'return=representation'
        }
      });

      return response.data.length > 0 ? this.mapFromDatabase(response.data[0]) : null;
    } catch (error: any) {
      console.error('Erro ao atualizar link no Supabase:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error('Erro ao atualizar link');
    }
  }

  async deleteLink(id: string): Promise<RedirectLink | null> {
    try {
      const config = this.getConfig();

      const response = await axios.delete(`/redirect_links?id=eq.${id}`, {
        ...config,
        headers: {
          ...config.headers,
          'Prefer': 'return=representation'
        }
      });

      return response.data.length > 0 ? this.mapFromDatabase(response.data[0]) : null;
    } catch (error: any) {
      console.error('Erro ao deletar link no Supabase:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error('Erro ao deletar link');
    }
  }

  async findLink(serviceKey: string, quantity?: number): Promise<RedirectLink | null> {
    try {
      const config = this.getConfig();

      // Buscar link específico primeiro (com quantidade)
      let url = `/redirect_links?service_key=eq.${serviceKey}&active=eq.true`;
      
      if (quantity !== undefined) {
        url += `&quantity=eq.${quantity}`;
      } else {
        url += `&quantity=is.null`;
      }

      let response = await axios.get(url, config);

      if (response.data.length === 0 && quantity !== undefined) {
        // Se não encontrou específico, buscar geral (sem quantidade)
        const generalUrl = `/redirect_links?service_key=eq.${serviceKey}&active=eq.true&quantity=is.null`;
        response = await axios.get(generalUrl, config);
      }

      return response.data.length > 0 ? this.mapFromDatabase(response.data[0]) : null;
    } catch (error: any) {
      console.error('Erro ao buscar link no Supabase:', error.response?.data || error.message);
      throw new Error('Erro ao buscar link');
    }
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