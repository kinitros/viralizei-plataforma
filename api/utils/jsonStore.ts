import * as fs from 'fs';
import * as path from 'path';

// Fallback for serverless environments that don't support __dirname
const __dirname = process.cwd();

const storePath = path.join(__dirname, '..', 'data', 'checkout.json');

// Fallback em memória para ambientes serverless (ex.: Vercel)
const memoryStores: Record<string, any> = (globalThis as any).__JSON_MEMORY_STORES || ((globalThis as any).__JSON_MEMORY_STORES = {});

interface CheckoutStore {
  links: Record<string, string>;
}

function ensureStore(): CheckoutStore {
  try {
    // In Vercel, try to read from file system first
    if (fs.existsSync(storePath)) {
      const raw = fs.readFileSync(storePath, 'utf-8');
      const parsed = JSON.parse(raw || '{}');
      if (!parsed.links) parsed.links = {};
      return parsed as CheckoutStore;
    }
    
    // If file doesn't exist, create initial store
    const initial: CheckoutStore = { links: {} };
    
    // Try to create directory and file (will fail in Vercel production, but that's ok)
    try {
      const dir = path.dirname(storePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(storePath, JSON.stringify(initial, null, 2), 'utf-8');
    } catch (writeError) {
      // Ignore write errors in production (Vercel read-only filesystem)
      console.log('Cannot write to filesystem (expected in production):', (writeError as any).message);
    }
    
    return initial;
  } catch (e) {
    // fallback in case of read errors
    console.log('Error reading store:', (e as any).message);
    return { links: {} };
  }
}

export function readCheckoutStore(): CheckoutStore {
  return ensureStore();
}

export function writeCheckoutStore(newStore: CheckoutStore): void {
  try {
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(storePath, JSON.stringify(newStore, null, 2), 'utf-8');
  } catch (e) {
    // swallow write errors to avoid crashing; caller may still proceed
    console.log('Cannot write to store (expected in Vercel production):', (e as any).message);
  }
}

export function setCheckoutLink(key: string, url: string): CheckoutStore {
  const store = ensureStore();
  store.links[key] = url;
  writeCheckoutStore(store);
  return store;
}

export function deleteCheckoutLink(key: string): CheckoutStore {
  const store = ensureStore();
  delete store.links[key];
  writeCheckoutStore(store);
  return store;
}

/**
 * Lê um arquivo JSON de forma segura
 */
export async function readJsonFile(filePath: string): Promise<any> {
  try {
    // 1) Priorizar store em memória quando existir
    if (memoryStores[filePath]) {
      return memoryStores[filePath];
    }

    // Garantir que o diretório existe (em dev/local)
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {}
    }

    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      // Se não existe, usar estrutura padrão e registrar em memória
      const defaultData = { customRedirects: [] };
      memoryStores[filePath] = defaultData;
      // Em ambientes com FS gravável (dev), tentar criar arquivo
      try {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      } catch {}
      return defaultData;
    }

    // Ler e parsear o arquivo
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    // Sincronizar em memória
    memoryStores[filePath] = parsed;
    return parsed;
  } catch (error) {
    console.error('Erro ao ler arquivo JSON:', error);
    // fallback para memória se existir, sem quebrar requisição
    if (memoryStores[filePath]) {
      return memoryStores[filePath];
    }
    return { customRedirects: [] };
  }
}

/**
 * Escreve dados em um arquivo JSON de forma segura
 */
export async function writeJsonFile(filePath: string, data: any): Promise<void> {
  try {
    // Atualizar memória sempre
    memoryStores[filePath] = data;

    // Tentar gravar em disco (funciona em dev/local). Em Vercel pode falhar.
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    // Não lançar erro: evita 500 em ambientes read-only
    console.warn('Gravação no disco falhou, usando store em memória:', (error as any).message);
    // Mantemos dados em memória e seguimos.
  }
}