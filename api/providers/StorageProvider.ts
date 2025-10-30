export interface RedirectLink {
  id: string;
  serviceKey: string;
  quantity?: number;
  url: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RedirectLinksData {
  customRedirects: RedirectLink[];
}

export abstract class StorageProvider {
  abstract getAllLinks(): Promise<RedirectLink[]>;
  abstract createLink(link: Omit<RedirectLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<RedirectLink>;
  abstract updateLink(id: string, updates: Partial<RedirectLink>): Promise<RedirectLink | null>;
  abstract deleteLink(id: string): Promise<RedirectLink | null>;
  abstract findLink(serviceKey: string, quantity?: number): Promise<RedirectLink | null>;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}