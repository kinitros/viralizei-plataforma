import { StorageProvider, RedirectLink, RedirectLinksData, generateId } from './StorageProvider.js';
import { readJsonFile, writeJsonFile } from '../utils/jsonStore.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FileStorageProvider extends StorageProvider {
  private filePath: string;

  constructor(filePath?: string) {
    super();
    this.filePath = filePath || path.join(__dirname, '../data/redirectLinks.json');
  }

  async getAllLinks(): Promise<RedirectLink[]> {
    const data: RedirectLinksData = await readJsonFile(this.filePath);
    return data.customRedirects || [];
  }

  async createLink(link: Omit<RedirectLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<RedirectLink> {
    const data: RedirectLinksData = await readJsonFile(this.filePath);
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

    data.customRedirects.push(newLink);
    await writeJsonFile(this.filePath, data);

    return newLink;
  }

  async updateLink(id: string, updates: Partial<RedirectLink>): Promise<RedirectLink | null> {
    const data: RedirectLinksData = await readJsonFile(this.filePath);
    const linkIndex = data.customRedirects.findIndex(link => link.id === id);

    if (linkIndex === -1) {
      return null;
    }

    const updatedLink = {
      ...data.customRedirects[linkIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    data.customRedirects[linkIndex] = updatedLink;
    await writeJsonFile(this.filePath, data);

    return updatedLink;
  }

  async deleteLink(id: string): Promise<RedirectLink | null> {
    const data: RedirectLinksData = await readJsonFile(this.filePath);
    const linkIndex = data.customRedirects.findIndex(link => link.id === id);

    if (linkIndex === -1) {
      return null;
    }

    const deletedLink = data.customRedirects.splice(linkIndex, 1)[0];
    await writeJsonFile(this.filePath, data);

    return deletedLink;
  }

  async findLink(serviceKey: string, quantity?: number): Promise<RedirectLink | null> {
    const data: RedirectLinksData = await readJsonFile(this.filePath);
    
    // Buscar link específico primeiro (com quantidade)
    let link = data.customRedirects.find(
      l => l.serviceKey === serviceKey && 
           l.quantity === quantity &&
           l.active
    );

    // Se não encontrou específico, buscar geral (sem quantidade)
    if (!link) {
      link = data.customRedirects.find(
        l => l.serviceKey === serviceKey && 
             l.quantity === undefined &&
             l.active
      );
    }

    return link || null;
  }
}