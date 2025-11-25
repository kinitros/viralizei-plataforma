import { getCustomRedirectUrl } from './serviceConfig';
import { productService } from '../services/productService';
import { packCheckoutData } from '../lib/encryption';

// Tipos de serviços disponíveis
export type ServiceType = 
  | 'followers' | 'likes' | 'views' | 'subscribers' | 'comments';

export type Platform = 
  | 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'kwai';

export type Region = 'br' | 'world' | 'reels' | 'stories';

// Interface para definir um serviço
export interface ServiceConfig {
  platform: Platform;
  type: ServiceType;
  region?: Region;
  customKey?: string; // Para casos especiais
}

// Mapeamento de serviços para chaves de checkout
const SERVICE_KEY_MAP: Record<string, string> = {
  // Instagram
  'instagram.followers.br': 'instagram.followers.br',
  'instagram.followers.world': 'instagram.followers.world',
  'instagram.likes.br': 'instagram.likes.br',
  'instagram.likes.world': 'instagram.likes.world',
  'instagram.views.reels': 'instagram.views.reels',
  'instagram.views.stories': 'instagram.views.stories',
  
  // TikTok
  'tiktok.followers.br': 'tiktok.followers.br',
  'tiktok.followers.world': 'tiktok.followers.world',
  'tiktok.likes.br': 'tiktok.likes.br',
  'tiktok.likes.world': 'tiktok.likes.world',
  'tiktok.views': 'tiktok.views',
  
  // YouTube
  'youtube.subscribers': 'youtube.subscribers',
  'youtube.likes': 'youtube.likes',
  'youtube.views': 'youtube.views',
  
  // Facebook
  'facebook.followers.world': 'facebook.followers.world',
  'facebook.likes.world': 'facebook.likes.world',
  'facebook.views': 'facebook.views',
  
  // Twitter/X
  'twitter.followers': 'twitter.followers',
  'twitter.likes': 'twitter.likes',
  'twitter.views': 'twitter.views',
  
  // Kwai
  'kwai.followers.br': 'kwai.followers.br',
  'kwai.likes.br': 'kwai.likes.br',
  'kwai.views': 'kwai.views',
};

/**
 * Gera a chave do serviço baseada na configuração
 */
function generateServiceKey(config: ServiceConfig): string {
  if (config.customKey) {
    return config.customKey;
  }
  
  const parts: string[] = [config.platform, config.type];
  if (config.region) {
    parts.push(config.region);
  }
  
  return parts.join('.');
}

/**
 * Função centralizada para redirecionar para checkout de qualquer serviço
 * 
 * @param config - Configuração do serviço (platform, type, region)
 * @param quantity - Quantidade do serviço
 * @param customUrl - URL personalizada (opcional, sobrescreve o sistema de checkout)
 */
export async function redirectToService(
  config: ServiceConfig, 
  quantity: number, 
  customUrl?: string
): Promise<void> {
  try {
    let navigated = false;
    if (customUrl && customUrl.includes('/checkout/')) {
      console.info('[redirectToService] Navegando para checkout interno customizado:', customUrl);
      window.location.assign(customUrl);
      return;
    }

    const serviceKey = generateServiceKey(config);

    try {
      const [platform, type, regionRaw] = serviceKey.split('.');
      const region = regionRaw === 'world' ? 'worldwide' : regionRaw === 'br' ? 'brazil' : regionRaw;
      const products = await productService.getProducts({ network: platform, service_type: type, region, is_active: true } as any);
      const match = products.find((p: any) => p.quantity === quantity && p.is_active);
      if (match) {
        console.info('[redirectToService] Produto encontrado:', serviceKey, 'qty:', quantity, 'price:', match.price);
        if (serviceKey.startsWith('instagram.')) {
          const search = new URLSearchParams({ key: serviceKey, qty: String(quantity), price: String(match.price) });
          const instagramUrl = `/checkout/instagram?${search.toString()}`;
          window.location.assign(instagramUrl);
          navigated = true;
          return;
        }
        const data = packCheckoutData({ key: serviceKey, qty: quantity, price: match.price });
        const checkoutUrl = `/checkout/${config.platform}?data=${encodeURIComponent(data)}`;
        window.location.assign(checkoutUrl);
        navigated = true;
        return;
      }
    } catch (productError) {
      console.warn('[redirectToService] Produto não encontrado, tentando fallback...', productError);
    }

    const configuredUrl = await getCustomRedirectUrl(serviceKey, quantity);
    if (configuredUrl && configuredUrl.includes('/checkout/')) {
      console.info('[redirectToService] Navegando para checkout interno configurado:', configuredUrl);
      window.location.assign(configuredUrl);
      navigated = true;
      return;
    }

    if (!SERVICE_KEY_MAP[serviceKey]) {
      console.warn(`Serviço não mapeado: ${serviceKey}`);
      return;
    }

    if (serviceKey.startsWith('instagram.')) {
      const search = new URLSearchParams({ key: serviceKey, qty: String(quantity) });
      console.info('[redirectToService] Levando ao checkout interno:', `/checkout/instagram?${search.toString()}`);
      window.location.assign(`/checkout/instagram?${search.toString()}`);
      navigated = true;
      return;
    }

    const data = packCheckoutData({ key: serviceKey, qty: quantity, price: '' });
    const fallbackUrl = `/checkout/${config.platform}?data=${encodeURIComponent(data)}`;
    console.info('[redirectToService] Usando checkout genérico como fallback:', fallbackUrl);
    window.location.assign(fallbackUrl);
    navigated = true;
    return;

  } catch (error) {
    console.error('Erro no redirecionamento:', error);
  }
}

/**
 * Função simplificada para serviços do Instagram
 */
export const redirectToInstagram = {
  followersBR: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'instagram', type: 'followers', region: 'br' }, qty, customUrl),
  
  followersWorld: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'instagram', type: 'followers', region: 'world' }, qty, customUrl),
  
  likesBR: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'instagram', type: 'likes', region: 'br' }, qty, customUrl),
  
  likesWorld: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'instagram', type: 'likes', region: 'world' }, qty, customUrl),
  
  viewsReels: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'instagram', type: 'views', region: 'reels' }, qty, customUrl),
  
  viewsStories: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'instagram', type: 'views', region: 'stories' }, qty, customUrl),
};

/**
 * Função simplificada para serviços do TikTok
 */
export const redirectToTikTok = {
  followersBR: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'tiktok', type: 'followers', region: 'br' }, qty, customUrl),
  
  followersWorld: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'tiktok', type: 'followers', region: 'world' }, qty, customUrl),
  
  likesBR: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'tiktok', type: 'likes', region: 'br' }, qty, customUrl),
  
  likesWorld: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'tiktok', type: 'likes', region: 'world' }, qty, customUrl),
  
  views: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'tiktok', type: 'views' }, qty, customUrl),
};

/**
 * Função simplificada para serviços do YouTube
 */
export const redirectToYouTube = {
  subscribers: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'youtube', type: 'subscribers' }, qty, customUrl),
  
  likes: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'youtube', type: 'likes' }, qty, customUrl),
  
  views: (qty: number, customUrl?: string) => 
    redirectToService({ platform: 'youtube', type: 'views' }, qty, customUrl),
};

/**
 * Função para adicionar/atualizar mapeamento de serviços em runtime
 * Útil para adicionar novos serviços sem modificar código
 */
export function addServiceMapping(serviceKey: string, checkoutKey: string): void {
  SERVICE_KEY_MAP[serviceKey] = checkoutKey;
}

/**
 * Função para listar todos os serviços mapeados
 */
export function getAvailableServices(): string[] {
  return Object.keys(SERVICE_KEY_MAP);
}

/**
 * Função para verificar se um serviço está disponível
 */
export function isServiceAvailable(config: ServiceConfig): boolean {
  const serviceKey = generateServiceKey(config);
  return serviceKey in SERVICE_KEY_MAP;
}

/**
 * Gera URL interna padrão para um serviço
 * @param serviceKey - Chave do serviço
 * @param quantity - Quantidade
 * @returns URL interna padrão
 */
export function generateInternalUrl(serviceKey: string, quantity: number): string {
  if (serviceKey.startsWith('instagram.')) {
    return `/checkout/instagram?key=${serviceKey}&qty=${quantity}`;
  }

  const [platform] = serviceKey.split('.');
  const data = packCheckoutData({ key: serviceKey, qty: quantity, price: '' });
  return `/checkout/${platform}?data=${encodeURIComponent(data)}`;
}

/**
 * Alterna entre link customizado e link interno padrão
 * @param serviceKey - Chave do serviço
 * @param quantity - Quantidade
 * @param currentUrl - URL atual (opcional)
 * @returns Objeto com URL e indicador de tipo
 */
export async function toggleBetweenCustomAndInternal(
  serviceKey: string, 
  quantity: number,
  currentUrl?: string
): Promise<{ url: string; isInternal: boolean }> {
  
  // Se tem URL atual e é customizada, retornar a interna
  if (currentUrl && !currentUrl.includes('/checkout/')) {
    const internalUrl = generateInternalUrl(serviceKey, quantity);
    return { url: internalUrl, isInternal: true };
  }
  
  // Tentar buscar URL customizada
  const customUrl = await getCustomRedirectUrl(serviceKey, quantity);
  
  if (customUrl) {
    return { url: customUrl, isInternal: false };
  }
  
  // Se não tem customizada, retornar a interna
  const internalUrl = generateInternalUrl(serviceKey, quantity);
  return { url: internalUrl, isInternal: true };
}
