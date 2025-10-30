# 🔗 Sistema de Redirecionamento Personalizado

Este sistema permite configurar URLs personalizadas para todos os botões "Comprar Agora" dos serviços.

## 📋 Como Funciona

O sistema verifica URLs personalizadas **antes** de usar o sistema padrão de checkout. Você pode configurar:

1. **URLs específicas** para uma quantidade exata (ex: 1000 seguidores)
2. **URLs gerais** para todas as quantidades de um serviço
3. **URLs diretas** passadas como parâmetro

## 🚀 Formas de Configurar

### 1. Editando o arquivo `serviceConfig.ts`

```typescript
// src/lib/serviceConfig.ts
export const CUSTOM_REDIRECTS: CustomRedirectConfig[] = [
  // URL específica para 1000 seguidores brasileiros do Instagram
  {
    serviceKey: 'instagram.followers.br',
    quantity: 1000,
    url: 'https://seguro.seguidorprime.com/r/8KFQQOQO4L',
    description: 'Link promocional para 1000 seguidores BR'
  },
  
  // URL padrão para TODOS os seguidores mundiais do Instagram
  {
    serviceKey: 'instagram.followers.world',
    url: 'https://seguro.seguidorprime.com/r/FVREWYLOBK',
    description: 'Link padrão para seguidores mundiais'
  },
];
```

### 2. Usando o RedirectManager (via console do navegador)

```javascript
// No console do navegador (F12):

// Adicionar URL específica para 500 seguidores BR
RedirectManager.addUrl('instagram', 'followers', 'br', 500, 'https://meulink.com/500-br');

// Adicionar URL geral para todas as curtidas mundiais
RedirectManager.addUrl('instagram', 'likes', 'world', null, 'https://meulink.com/likes-world');

// Listar todas as URLs configuradas
RedirectManager.listUrls();

// Remover uma URL
RedirectManager.removeUrl('instagram', 'followers', 'br', 500);
```

### 3. Usando QuickSetup (mais fácil)

```javascript
// No console do navegador:

// Instagram
QuickSetup.instagram.followersBR(1000, 'https://meulink.com/1000-br', 'Promoção especial');
QuickSetup.instagram.followersWorld(null, 'https://meulink.com/world', 'Link geral');
QuickSetup.instagram.likesBR(500, 'https://meulink.com/500-likes-br');

// TikTok
QuickSetup.tiktok.followersBR(2000, 'https://meulink.com/tiktok-2000-br');
QuickSetup.tiktok.views(null, 'https://meulink.com/tiktok-views');

// YouTube
QuickSetup.youtube.subscribers(1000, 'https://meulink.com/youtube-1000-subs');
```

## 🎯 Exemplos Práticos

### Cenário 1: URLs diferentes por quantidade
```javascript
// 500 seguidores -> Link A
QuickSetup.instagram.followersBR(500, 'https://checkout.com/promo-500');

// 1000 seguidores -> Link B  
QuickSetup.instagram.followersBR(1000, 'https://checkout.com/promo-1000');

// Outras quantidades -> Sistema padrão (Admin Checkout)
```

### Cenário 2: URL geral para um serviço
```javascript
// Todas as quantidades de curtidas mundiais vão para o mesmo link
QuickSetup.instagram.likesWorld(null, 'https://checkout.com/likes-world');
```

### Cenário 3: Misturando configurações
```javascript
// Configuração específica para 1000
QuickSetup.instagram.followersBR(1000, 'https://promo.com/1000-especial');

// Configuração geral para outras quantidades
QuickSetup.instagram.followersBR(null, 'https://checkout.com/followers-br');

// Resultado:
// - 1000 seguidores -> https://promo.com/1000-especial
// - Outras quantidades -> https://checkout.com/followers-br
```

## 🔧 Testando Configurações

```javascript
// Testar um redirecionamento
RedirectManager.testRedirect('instagram', 'followers', 'br', 1000);

// Ver todas as configurações
RedirectManager.listUrls();
```

## 📊 Prioridade do Sistema

1. **URL personalizada específica** (serviceKey + quantity)
2. **URL personalizada geral** (serviceKey sem quantity)
3. **Sistema padrão** (Admin Checkout + variáveis de ambiente)
4. **Erro** se nada estiver configurado

## 🛠️ Serviços Disponíveis

### Instagram
- `instagram.followers.br` - Seguidores Brasileiros
- `instagram.followers.world` - Seguidores Mundiais
- `instagram.likes.br` - Curtidas Brasileiras
- `instagram.likes.world` - Curtidas Mundiais
- `instagram.views.reels` - Visualizações Reels
- `instagram.views.stories` - Visualizações Stories

### TikTok
- `tiktok.followers.br` - Seguidores Brasileiros
- `tiktok.followers.world` - Seguidores Mundiais
- `tiktok.likes.br` - Curtidas Brasileiras
- `tiktok.likes.world` - Curtidas Mundiais
- `tiktok.views` - Visualizações

### YouTube
- `youtube.subscribers` - Inscritos
- `youtube.likes` - Curtidas
- `youtube.views` - Visualizações

### Facebook
- `facebook.followers.world` - Seguidores
- `facebook.likes.world` - Curtidas
- `facebook.views` - Visualizações

### Twitter/X
- `twitter.followers` - Seguidores
- `twitter.likes` - Curtidas
- `twitter.views` - Visualizações

### Kwai
- `kwai.followers.br` - Seguidores Brasileiros
- `kwai.likes.br` - Curtidas Brasileiras
- `kwai.views` - Visualizações

## 💡 Dicas

1. **URLs específicas** têm prioridade sobre **URLs gerais**
2. Use `null` na quantidade para aplicar a **todas as quantidades**
3. O sistema é **case-sensitive** nas chaves
4. URLs são testadas na ordem: específica → geral → padrão
5. Configure no console para **testes rápidos**, no código para **produção**

## 🔍 Debug

```javascript
// Ver configurações atuais
RedirectManager.listUrls();

// Testar um serviço específico
RedirectManager.testRedirect('instagram', 'followers', 'br', 1000);

// Limpar todas as configurações (recarregar página)
location.reload();
```