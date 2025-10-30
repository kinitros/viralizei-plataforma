// Sistema de configuração para URLs personalizadas de redirecionamento
// Este arquivo permite configurar URLs específicas para cada serviço e quantidade

export interface CustomRedirectConfig {
  serviceKey: string;
  quantity?: number; // Se não especificado, aplica para todas as quantidades
  url: string;
  description?: string;
}

// Configurações personalizadas de redirecionamento
// URLs configuradas aqui serão aplicadas para TODOS os usuários que acessarem o site
export const CUSTOM_REDIRECTS: CustomRedirectConfig[] = [
  // ===== INSTAGRAM =====
  
  // Seguidores Brasileiros - Links específicos por quantidade
  {
    serviceKey: 'instagram.followers.br',
    quantity: 500,
    url: 'https://seulink.com/instagram-500-seguidores-br',
    description: '500 Seguidores Brasileiros Instagram'
  },
  {
    serviceKey: 'instagram.followers.br',
    quantity: 1000,
    url: 'https://seulink.com/instagram-1000-seguidores-br',
    description: '1000 Seguidores Brasileiros Instagram'
  },
  {
    serviceKey: 'instagram.followers.br',
    quantity: 2000,
    url: 'https://seulink.com/instagram-2000-seguidores-br',
    description: '2000 Seguidores Brasileiros Instagram'
  },
  
  // Seguidores Mundiais - Links específicos por quantidade
  {
    serviceKey: 'instagram.followers.world',
    quantity: 1000,
    url: 'https://seulink.com/instagram-1000-seguidores-world',
    description: '1000 Seguidores Mundiais Instagram'
  },
  {
    serviceKey: 'instagram.followers.world',
    quantity: 2000,
    url: 'https://seulink.com/instagram-2000-seguidores-world',
    description: '2000 Seguidores Mundiais Instagram'
  },
  
  // Curtidas Brasileiras
  {
    serviceKey: 'instagram.likes.br',
    quantity: 500,
    url: 'https://seulink.com/instagram-500-curtidas-br',
    description: '500 Curtidas Brasileiras Instagram'
  },
  {
    serviceKey: 'instagram.likes.br',
    quantity: 1000,
    url: 'https://seulink.com/instagram-1000-curtidas-br',
    description: '1000 Curtidas Brasileiras Instagram'
  },
  
  // ===== TIKTOK =====
  
  // Seguidores TikTok Brasil
  {
    serviceKey: 'tiktok.followers.br',
    quantity: 1000,
    url: 'https://seulink.com/tiktok-1000-seguidores-br',
    description: '1000 Seguidores TikTok Brasil'
  },
  
  // Views TikTok
  {
    serviceKey: 'tiktok.views',
    quantity: 10000,
    url: 'https://seulink.com/tiktok-10k-views',
    description: '10.000 Views TikTok'
  },
  
  // ===== YOUTUBE =====
  
  // Inscritos YouTube
  {
    serviceKey: 'youtube.subscribers',
    quantity: 1000,
    url: 'https://seulink.com/youtube-1000-inscritos',
    description: '1000 Inscritos YouTube'
  },
  
  // Views YouTube
  {
    serviceKey: 'youtube.views',
    quantity: 50000,
    url: 'https://seulink.com/youtube-50k-views',
    description: '50.000 Views YouTube'
  },
  
  // ===== LINKS GERAIS (aplicam para todas as quantidades não especificadas) =====
  
  // Link geral para seguidores Instagram Brasil (outras quantidades)
  // {
  //   serviceKey: 'instagram.followers.br',
  //   url: 'https://seulink.com/instagram-seguidores-br-geral',
  //   description: 'Link geral para seguidores Instagram Brasil'
  // },
  
  // Adicione mais configurações conforme necessário...
];

// Função para buscar URL customizada da API remota
export async function getRemoteCustomRedirectUrl(serviceKey: string, quantity?: number): Promise<string | null> {
  try {
    const params = new URLSearchParams({ serviceKey });
    if (quantity) {
      params.append('quantity', quantity.toString());
    }

    const response = await fetch(`/api/redirect-links/find?${params}`);
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data.url;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar URL remota:', error);
    return null;
  }
}

/**
 * Busca uma URL personalizada para um serviço específico
 * @param serviceKey - Chave do serviço (ex: 'instagram.followers.br')
 * @param quantity - Quantidade do serviço
 * @returns URL personalizada ou null se não encontrada
 */
export async function getCustomRedirectUrl(serviceKey: string, quantity: number): Promise<string | null> {
  // 1. Primeiro, tentar buscar da API remota
  const remoteUrl = await getRemoteCustomRedirectUrl(serviceKey, quantity);
  if (remoteUrl) {
    return remoteUrl;
  }

  // 2. Se não encontrou na API, buscar nas configurações locais
  // Primeiro, procura por uma configuração específica para a quantidade
  const specificConfig = CUSTOM_REDIRECTS.find(
    config => config.serviceKey === serviceKey && config.quantity === quantity
  );
  
  if (specificConfig) {
    return specificConfig.url;
  }
  
  // Se não encontrou específica, procura por uma configuração geral (sem quantidade)
  const generalConfig = CUSTOM_REDIRECTS.find(
    config => config.serviceKey === serviceKey && !config.quantity
  );
  
  return generalConfig?.url || null;
}

/**
 * Adiciona uma nova configuração de redirecionamento
 * @param config - Configuração do redirecionamento
 */
export function addCustomRedirect(config: CustomRedirectConfig): void {
  // Remove configuração existente se houver
  const existingIndex = CUSTOM_REDIRECTS.findIndex(
    existing => existing.serviceKey === config.serviceKey && existing.quantity === config.quantity
  );
  
  if (existingIndex >= 0) {
    CUSTOM_REDIRECTS[existingIndex] = config;
  } else {
    CUSTOM_REDIRECTS.push(config);
  }
}

/**
 * Remove uma configuração de redirecionamento
 * @param serviceKey - Chave do serviço
 * @param quantity - Quantidade (opcional)
 */
export function removeCustomRedirect(serviceKey: string, quantity?: number): boolean {
  const index = CUSTOM_REDIRECTS.findIndex(
    config => config.serviceKey === serviceKey && config.quantity === quantity
  );
  
  if (index >= 0) {
    CUSTOM_REDIRECTS.splice(index, 1);
    return true;
  }
  
  return false;
}

/**
 * Lista todas as configurações personalizadas
 */
export function getAllCustomRedirects(): CustomRedirectConfig[] {
  return [...CUSTOM_REDIRECTS];
}

/**
 * Verifica se existe uma configuração personalizada para um serviço
 */
export function hasCustomRedirect(serviceKey: string, quantity?: number): boolean {
  return CUSTOM_REDIRECTS.some(
    config => config.serviceKey === serviceKey && 
    (quantity === undefined || config.quantity === quantity || config.quantity === undefined)
  );
}

// Configurações pré-definidas para facilitar o uso
export const PREDEFINED_SERVICES = {
  instagram: {
    followers: {
      br: 'instagram.followers.br',
      world: 'instagram.followers.world'
    },
    likes: {
      br: 'instagram.likes.br',
      world: 'instagram.likes.world'
    },
    views: {
      reels: 'instagram.views.reels',
      stories: 'instagram.views.stories'
    }
  },
  tiktok: {
    followers: {
      br: 'tiktok.followers.br',
      world: 'tiktok.followers.world'
    },
    likes: {
      br: 'tiktok.likes.br',
      world: 'tiktok.likes.world'
    },
    views: 'tiktok.views'
  },
  youtube: {
    subscribers: 'youtube.subscribers',
    likes: 'youtube.likes',
    views: 'youtube.views'
  },
  facebook: {
    followers: 'facebook.followers.world',
    likes: 'facebook.likes.world',
    views: 'facebook.views'
  },
  twitter: {
    followers: 'twitter.followers',
    likes: 'twitter.likes',
    views: 'twitter.views'
  },
  kwai: {
    followers: 'kwai.followers.br',
    likes: 'kwai.likes.br',
    views: 'kwai.views'
  }
};