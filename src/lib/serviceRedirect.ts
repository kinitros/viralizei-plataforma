import { openCheckout } from './checkout';
import { getCustomRedirectUrl } from './serviceConfig';

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
    // Se uma URL personalizada foi fornecida, redireciona diretamente
    if (customUrl) {
      window.open(customUrl, '_blank');
      return;
    }
    
    // Gera a chave do serviço
    const serviceKey = generateServiceKey(config);
    
    // Verifica se existe uma URL personalizada configurada (da API remota ou configuração local)
    const configuredUrl = await getCustomRedirectUrl(serviceKey, quantity);
    if (configuredUrl) {
      window.open(configuredUrl, '_blank');
      return;
    }
    
    // Verifica se o serviço está mapeado no sistema padrão
    if (!SERVICE_KEY_MAP[serviceKey]) {
      console.warn(`Serviço não mapeado: ${serviceKey}`);
      alert(`Serviço ${serviceKey} não está disponível no momento. Entre em contato com o suporte.`);
      return;
    }
    
    // Usa a função openCheckout existente
    await openCheckout(SERVICE_KEY_MAP[serviceKey], quantity);
    
  } catch (error) {
    console.error('Erro no redirecionamento:', error);
    // Em caso de erro, usar sistema padrão
    if (config.customKey || SERVICE_KEY_MAP[generateServiceKey(config)]) {
      openCheckout(SERVICE_KEY_MAP[generateServiceKey(config)], quantity);
    }
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