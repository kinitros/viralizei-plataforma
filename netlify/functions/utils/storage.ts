// Simplified storage implementation for Netlify Functions
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

// Simple memory storage for Netlify Functions
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
      this.instance = new MemoryStorageProvider();
    }
    return this.instance;
  }
}