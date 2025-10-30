import { StorageProvider } from './StorageProvider.js';
import { SupabaseStorageProvider } from './SupabaseStorageProvider.js';
import { FileStorageProvider } from './FileStorageProvider.js';
import { MemoryStorageProvider } from './MemoryStorageProvider.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export type StorageProviderType = 'supabase' | 'file' | 'memory';

export class StorageProviderFactory {
  private static instance: StorageProvider | null = null;

  static getProvider(): StorageProvider {
    if (!this.instance) {
      this.instance = this.createProvider();
    }
    return this.instance;
  }

  private static createProvider(): StorageProvider {
    const providerType = this.getProviderType();
    
    console.log(`Inicializando storage provider: ${providerType}`);

    switch (providerType) {
      case 'supabase':
        return new SupabaseStorageProvider();
      
      case 'file':
        return new FileStorageProvider();
      
      case 'memory':
        return new MemoryStorageProvider();
      
      default:
        console.warn(`Provider desconhecido: ${providerType}, usando file como fallback`);
        return new FileStorageProvider();
    }
  }

  private static getProviderType(): StorageProviderType {
    const envProvider = process.env.STORAGE_PROVIDER?.toLowerCase() as StorageProviderType;
    
    // Se especificado explicitamente, usar
    if (envProvider && ['supabase', 'file', 'memory'].includes(envProvider)) {
      // Verificar se Supabase está configurado quando solicitado
      if (envProvider === 'supabase' && !isSupabaseConfigured()) {
        console.warn('Supabase solicitado mas não configurado, usando file como fallback');
        return 'file';
      }
      return envProvider;
    }

    // Auto-detecção: preferir Supabase se configurado, senão file
    if (isSupabaseConfigured()) {
      return 'supabase';
    }

    return 'file';
  }

  // Método para resetar a instância (útil para testes)
  static reset(): void {
    this.instance = null;
  }
}