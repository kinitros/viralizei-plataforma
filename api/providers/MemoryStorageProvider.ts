import { StorageProvider, RedirectLink, generateId } from './StorageProvider.js';

export class MemoryStorageProvider extends StorageProvider {
  private links: RedirectLink[] = [];

  constructor(initialData?: RedirectLink[]) {
    super();
    if (initialData) {
      this.links = [...initialData];
    }
  }

  async getAllLinks(): Promise<RedirectLink[]> {
    return [...this.links];
  }

  async createLink(link: Omit<RedirectLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<RedirectLink> {
    const now = new Date().toISOString();

    const newLink: RedirectLink = {
      id: generateId(),
      serviceKey: link.serviceKey,
      quantity: link.quantity,
      url: link.url,
      description: link.description || '',
      active: link.active,
      createdAt: now,
      updatedAt: now
    };

    this.links.push(newLink);
    return newLink;
  }

  async updateLink(id: string, updates: Partial<RedirectLink>): Promise<RedirectLink | null> {
    const linkIndex = this.links.findIndex(link => link.id === id);

    if (linkIndex === -1) {
      return null;
    }

    const updatedLink = {
      ...this.links[linkIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.links[linkIndex] = updatedLink;
    return updatedLink;
  }

  async deleteLink(id: string): Promise<RedirectLink | null> {
    const linkIndex = this.links.findIndex(link => link.id === id);

    if (linkIndex === -1) {
      return null;
    }

    const deletedLink = this.links.splice(linkIndex, 1)[0];
    return deletedLink;
  }

  async findLink(serviceKey: string, quantity?: number): Promise<RedirectLink | null> {
    // Buscar link específico primeiro (com quantidade)
    let link = this.links.find(
      l => l.serviceKey === serviceKey && 
           l.quantity === quantity &&
           l.active
    );

    // Se não encontrou específico, buscar geral (sem quantidade)
    if (!link) {
      link = this.links.find(
        l => l.serviceKey === serviceKey && 
             l.quantity === undefined &&
             l.active
      );
    }

    return link || null;
  }

  // Método adicional para popular dados iniciais
  setInitialData(data: RedirectLink[]): void {
    this.links = [...data];
  }
}