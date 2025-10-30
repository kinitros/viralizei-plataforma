// Gerenciador de redirecionamentos - Interface simplificada para configurar URLs
import { addCustomRedirect, removeCustomRedirect, getAllCustomRedirects, PREDEFINED_SERVICES } from './serviceConfig';
import { redirectToService, ServiceConfig } from './serviceRedirect';

export class RedirectManager {
  /**
   * Adiciona uma URL personalizada para um serviço específico
   * @param platform - Plataforma (instagram, tiktok, etc.)
   * @param serviceType - Tipo do serviço (followers, likes, etc.)
   * @param region - Região (br, world, etc.) - opcional
   * @param quantity - Quantidade específica (opcional, se não especificado aplica para todas)
   * @param url - URL de destino
   * @param description - Descrição opcional
   */
  static addUrl(
    platform: string,
    serviceType: string,
    region: string | null,
    quantity: number | null,
    url: string,
    description?: string
  ): void {
    const serviceKey = region 
      ? `${platform}.${serviceType}.${region}`
      : `${platform}.${serviceType}`;
    
    addCustomRedirect({
      serviceKey,
      quantity: quantity || undefined,
      url,
      description
    });
    
    console.log(`✅ URL adicionada: ${serviceKey}${quantity ? ` (${quantity})` : ''} -> ${url}`);
  }
  
  /**
   * Remove uma URL personalizada
   */
  static removeUrl(
    platform: string,
    serviceType: string,
    region: string | null,
    quantity: number | null
  ): boolean {
    const serviceKey = region 
      ? `${platform}.${serviceType}.${region}`
      : `${platform}.${serviceType}`;
    
    const removed = removeCustomRedirect(serviceKey, quantity || undefined);
    
    if (removed) {
      console.log(`🗑️ URL removida: ${serviceKey}${quantity ? ` (${quantity})` : ''}`);
    } else {
      console.log(`❌ URL não encontrada: ${serviceKey}${quantity ? ` (${quantity})` : ''}`);
    }
    
    return removed;
  }
  
  /**
   * Lista todas as URLs configuradas
   */
  static listUrls(): void {
    const configs = getAllCustomRedirects();
    
    if (configs.length === 0) {
      console.log('📋 Nenhuma URL personalizada configurada');
      return;
    }
    
    console.log('📋 URLs personalizadas configuradas:');
    configs.forEach(config => {
      const qtyText = config.quantity ? ` (${config.quantity})` : ' (todas as quantidades)';
      console.log(`  • ${config.serviceKey}${qtyText} -> ${config.url}`);
      if (config.description) {
        console.log(`    📝 ${config.description}`);
      }
    });
  }
  
  /**
   * Testa um redirecionamento
   */
  static async testRedirect(
    platform: string,
    serviceType: string,
    region: string | null,
    quantity: number
  ): Promise<void> {
    const config: ServiceConfig = {
      platform: platform as any,
      type: serviceType as any,
      region: region as any
    };
    
    console.log(`🧪 Testando redirecionamento: ${platform}.${serviceType}${region ? `.${region}` : ''} (${quantity})`);
    
    try {
      await redirectToService(config, quantity);
    } catch (error) {
      console.error('❌ Erro no teste:', error);
    }
  }
}

// Funções de conveniência para uso rápido
export const QuickSetup = {
  /**
   * Configura URLs para Instagram
   */
  instagram: {
    followersBR: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('instagram', 'followers', 'br', quantity, url, description),
    
    followersWorld: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('instagram', 'followers', 'world', quantity, url, description),
    
    likesBR: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('instagram', 'likes', 'br', quantity, url, description),
    
    likesWorld: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('instagram', 'likes', 'world', quantity, url, description),
    
    viewsReels: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('instagram', 'views', 'reels', quantity, url, description),
    
    viewsStories: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('instagram', 'views', 'stories', quantity, url, description),
  },
  
  /**
   * Configura URLs para TikTok
   */
  tiktok: {
    followersBR: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('tiktok', 'followers', 'br', quantity, url, description),
    
    followersWorld: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('tiktok', 'followers', 'world', quantity, url, description),
    
    likesBR: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('tiktok', 'likes', 'br', quantity, url, description),
    
    likesWorld: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('tiktok', 'likes', 'world', quantity, url, description),
    
    views: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('tiktok', 'views', null, quantity, url, description),
  },
  
  /**
   * Configura URLs para YouTube
   */
  youtube: {
    subscribers: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('youtube', 'subscribers', null, quantity, url, description),
    
    likes: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('youtube', 'likes', null, quantity, url, description),
    
    views: (quantity: number | null, url: string, description?: string) =>
      RedirectManager.addUrl('youtube', 'views', null, quantity, url, description),
  }
};

// Exporta para uso global no console do navegador (para debug/configuração)
if (typeof window !== 'undefined') {
  (window as any).RedirectManager = RedirectManager;
  (window as any).QuickSetup = QuickSetup;
}