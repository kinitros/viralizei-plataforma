# 🔗 Como Configurar Links Permanentes

## ✅ **CONFIGURAÇÃO ATIVA**

Os links estão configurados no arquivo `src/lib/serviceConfig.ts` e funcionam para **TODOS os usuários** que acessarem o site.

## 📝 **Como Editar os Links**

### 1. **Abra o arquivo de configuração:**
```
src/lib/serviceConfig.ts
```

### 2. **Encontre o array CUSTOM_REDIRECTS:**
```typescript
export const CUSTOM_REDIRECTS: CustomRedirectConfig[] = [
  // Seus links aqui...
];
```

### 3. **Substitua os links de exemplo pelos seus links reais:**

#### **ANTES (exemplo):**
```typescript
{
  serviceKey: 'instagram.followers.br',
  quantity: 1000,
  url: 'https://seulink.com/instagram-1000-seguidores-br',
  description: '1000 Seguidores Brasileiros Instagram'
},
```

#### **DEPOIS (seu link real):**
```typescript
{
  serviceKey: 'instagram.followers.br',
  quantity: 1000,
  url: 'https://checkout.mercadopago.com/v1/redirect?pref_id=123456789',
  description: '1000 Seguidores Brasileiros Instagram'
},
```

## 🎯 **Links Já Configurados**

### **Instagram:**
- ✅ 500 Seguidores BR → `https://seulink.com/instagram-500-seguidores-br`
- ✅ 1000 Seguidores BR → `https://seulink.com/instagram-1000-seguidores-br`
- ✅ 2000 Seguidores BR → `https://seulink.com/instagram-2000-seguidores-br`
- ✅ 1000 Seguidores Mundial → `https://seulink.com/instagram-1000-seguidores-world`
- ✅ 2000 Seguidores Mundial → `https://seulink.com/instagram-2000-seguidores-world`
- ✅ 500 Curtidas BR → `https://seulink.com/instagram-500-curtidas-br`
- ✅ 1000 Curtidas BR → `https://seulink.com/instagram-1000-curtidas-br`

### **TikTok:**
- ✅ 1000 Seguidores BR → `https://seulink.com/tiktok-1000-seguidores-br`
- ✅ 10.000 Views → `https://seulink.com/tiktok-10k-views`

### **YouTube:**
- ✅ 1000 Inscritos → `https://seulink.com/youtube-1000-inscritos`
- ✅ 50.000 Views → `https://seulink.com/youtube-50k-views`

## ➕ **Como Adicionar Mais Links**

### **Formato básico:**
```typescript
{
  serviceKey: 'PLATAFORMA.SERVICO.REGIAO',
  quantity: QUANTIDADE,
  url: 'SEU_LINK_AQUI',
  description: 'Descrição do serviço'
},
```

### **Exemplos de serviceKey:**

#### **Instagram:**
- `instagram.followers.br` - Seguidores Brasileiros
- `instagram.followers.world` - Seguidores Mundiais
- `instagram.likes.br` - Curtidas Brasileiras
- `instagram.likes.world` - Curtidas Mundiais
- `instagram.views.reels` - Views Reels
- `instagram.views.stories` - Views Stories

#### **TikTok:**
- `tiktok.followers.br` - Seguidores Brasileiros
- `tiktok.followers.world` - Seguidores Mundiais
- `tiktok.likes.br` - Curtidas Brasileiras
- `tiktok.likes.world` - Curtidas Mundiais
- `tiktok.views` - Views

#### **YouTube:**
- `youtube.subscribers` - Inscritos
- `youtube.likes` - Curtidas
- `youtube.views` - Views

#### **Facebook:**
- `facebook.followers.world` - Seguidores
- `facebook.likes.world` - Curtidas
- `facebook.views` - Views

#### **Twitter/X:**
- `twitter.followers` - Seguidores
- `twitter.likes` - Curtidas
- `twitter.views` - Views

#### **Kwai:**
- `kwai.followers.br` - Seguidores Brasileiros
- `kwai.likes.br` - Curtidas Brasileiras
- `kwai.views` - Views

## 🔄 **Links Gerais (Todas as Quantidades)**

Para aplicar o mesmo link para **todas as quantidades** de um serviço, **omita** o campo `quantity`:

```typescript
{
  serviceKey: 'instagram.followers.br',
  // SEM quantity = aplica para todas as quantidades
  url: 'https://seulink.com/instagram-seguidores-br-geral',
  description: 'Link geral para seguidores Instagram Brasil'
},
```

## ⚡ **Prioridade dos Links**

1. **Link específico** (serviceKey + quantity) → **MAIOR PRIORIDADE**
2. **Link geral** (apenas serviceKey) → **PRIORIDADE MÉDIA**
3. **Sistema padrão** (Admin Checkout) → **FALLBACK**

## 🧪 **Como Testar**

1. **Salve o arquivo** `serviceConfig.ts` com seus links
2. **Recarregue o site** (Ctrl+F5)
3. **Vá para uma página de serviços**
4. **Clique em "Comprar Agora"**
5. **Será redirecionado** para o link configurado

## 🚨 **IMPORTANTE**

- **Substitua TODOS os links de exemplo** pelos seus links reais
- **Teste cada link** antes de colocar em produção
- **Use HTTPS** sempre que possível
- **Links inválidos** farão o sistema usar o padrão

## 📋 **Exemplo Completo**

```typescript
export const CUSTOM_REDIRECTS: CustomRedirectConfig[] = [
  // Instagram 1000 seguidores BR
  {
    serviceKey: 'instagram.followers.br',
    quantity: 1000,
    url: 'https://checkout.mercadopago.com/v1/redirect?pref_id=ABC123',
    description: '1000 Seguidores Instagram Brasil'
  },
  
  // TikTok geral (todas as quantidades)
  {
    serviceKey: 'tiktok.followers.br',
    url: 'https://pagseguro.uol.com.br/checkout/v2/payment.html?code=XYZ789',
    description: 'Seguidores TikTok Brasil - Geral'
  },
];
```

---

**✅ Configuração ativa! Todos os usuários serão redirecionados automaticamente.**