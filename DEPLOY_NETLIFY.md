# Deploy no Netlify - Guia Completo

Este guia explica como fazer deploy da aplicação Viralizei no Netlify, incluindo configuração de variáveis de ambiente e integração com Supabase.

## 📋 Pré-requisitos

- Conta no [Netlify](https://netlify.com)
- Repositório Git (GitHub, GitLab, ou Bitbucket)
- Conta no [Supabase](https://supabase.com) (opcional, mas recomendado)

## 🚀 Deploy Automático via Git

### 1. Conectar Repositório

1. Acesse o [painel do Netlify](https://app.netlify.com)
2. Clique em **"New site from Git"**
3. Escolha seu provedor Git (GitHub, GitLab, Bitbucket)
4. Selecione o repositório do projeto
5. Configure as opções de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### 2. Configurar Variáveis de Ambiente

No painel do Netlify, vá em **Site settings > Environment variables** e adicione:

#### Variáveis Obrigatórias
```bash
# Autenticação Admin
ADMIN_REDIRECT_PASSWORD=sua_senha_admin_aqui
ADMIN_PASSWORD=sua_senha_admin_aqui

# Storage Provider (recomendado: supabase)
STORAGE_PROVIDER=supabase
```

#### Variáveis do Supabase (Recomendado)
```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

#### Variáveis de Checkout (Opcionais)
```bash
# Exemplos de links de checkout
CHECKOUT_INSTAGRAM_FOLLOWERS_WORLD_DEFAULT=https://seu-link-checkout.com
CHECKOUT_TIKTOK_VIEWS_DEFAULT=https://seu-link-checkout.com
# ... adicione outros conforme necessário
```

## 🗄️ Configuração do Supabase

### 1. Criar Tabela de Redirect Links

Execute este SQL no editor do Supabase:

```sql
-- Criar tabela redirect_links
CREATE TABLE IF NOT EXISTS redirect_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_key TEXT NOT NULL,
  quantity INTEGER,
  url TEXT NOT NULL,
  description TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_redirect_links_service_key ON redirect_links(service_key);
CREATE INDEX IF NOT EXISTS idx_redirect_links_active ON redirect_links(active);
CREATE UNIQUE INDEX IF NOT EXISTS idx_redirect_links_service_quantity 
ON redirect_links(service_key, quantity) WHERE quantity IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_redirect_links_service_default 
ON redirect_links(service_key) WHERE quantity IS NULL;

-- Habilitar RLS (Row Level Security)
ALTER TABLE redirect_links ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (para busca de links)
CREATE POLICY "Allow public read access" ON redirect_links
FOR SELECT USING (true);

-- Política para operações admin (requer autenticação)
CREATE POLICY "Allow authenticated full access" ON redirect_links
FOR ALL USING (auth.role() = 'authenticated');

-- Conceder permissões
GRANT SELECT ON redirect_links TO anon;
GRANT ALL PRIVILEGES ON redirect_links TO authenticated;
```

### 2. Configurar Chaves do Supabase

1. No painel do Supabase, vá em **Settings > API**
2. Copie a **URL** e a **anon public key**
3. Adicione essas informações nas variáveis de ambiente do Netlify

## 🔧 Deploy Manual via CLI

### 1. Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Fazer Login

```bash
netlify login
```

### 3. Inicializar Site

```bash
netlify init
```

### 4. Deploy

```bash
# Deploy de teste
netlify deploy

# Deploy para produção
netlify deploy --prod
```

## 🧪 Teste Local com Netlify Dev

Para testar localmente com as Netlify Functions:

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run netlify:dev
```

A aplicação estará disponível em `http://localhost:8888`

## 📁 Estrutura de Arquivos

```
projeto/
├── netlify.toml              # Configuração do Netlify
├── public/_redirects         # Redirects para SPA
├── netlify/functions/        # Netlify Functions
│   ├── redirect-links.ts     # API de redirect links
│   ├── checkout.ts           # API de checkout
│   ├── auth.ts              # API de autenticação
│   └── utils/               # Utilitários
├── api/                     # APIs originais (mantidas para dev local)
└── src/                     # Frontend React
```

## 🔍 Troubleshooting

### Erro 404 nas Rotas

Se as rotas do React não funcionarem:
1. Verifique se o arquivo `public/_redirects` existe
2. Confirme se o `netlify.toml` tem os redirects configurados

### APIs não Funcionam

1. Verifique se as variáveis de ambiente estão configuradas
2. Confirme se `STORAGE_PROVIDER` está definido como `supabase` ou `memory`
3. Não use `file` como storage provider no Netlify

### Erro de Autenticação Admin

1. Verifique se `ADMIN_REDIRECT_PASSWORD` ou `ADMIN_PASSWORD` está configurado
2. Use o header `X-Admin-Password` nas requisições

### Problemas com Supabase

1. Confirme se a tabela `redirect_links` foi criada
2. Verifique se as políticas RLS estão ativas
3. Confirme se as permissões foram concedidas aos roles `anon` e `authenticated`

## 🌟 Vantagens do Netlify

- ✅ **Sem limite de funções serverless** (diferente do Vercel Hobby)
- ✅ **Deploy automático** via Git
- ✅ **HTTPS gratuito** com certificado SSL
- ✅ **CDN global** para performance
- ✅ **Rollback fácil** para versões anteriores
- ✅ **Preview de branches** para testes
- ✅ **Integração nativa** com Supabase

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de build no painel do Netlify
2. Use `netlify dev` para testar localmente
3. Confirme se todas as variáveis de ambiente estão configuradas
4. Verifique se o Supabase está configurado corretamente

---

**Nota**: Este projeto foi migrado do Vercel para o Netlify para resolver limitações de funções serverless. Todas as funcionalidades foram mantidas e otimizadas para o ambiente Netlify.