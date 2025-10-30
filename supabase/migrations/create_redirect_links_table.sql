-- Criar tabela redirect_links
CREATE TABLE IF NOT EXISTS public.redirect_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_key TEXT NOT NULL,
    quantity INTEGER,
    url TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para service_key para melhor performance
CREATE INDEX IF NOT EXISTS idx_redirect_links_service_key ON public.redirect_links(service_key);

-- Criar índice para active para filtros
CREATE INDEX IF NOT EXISTS idx_redirect_links_active ON public.redirect_links(active);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.redirect_links ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (anon)
CREATE POLICY "Allow public read access" ON public.redirect_links
    FOR SELECT USING (true);

-- Política para permitir todas as operações para usuários autenticados
CREATE POLICY "Allow authenticated full access" ON public.redirect_links
    FOR ALL USING (true);

-- Conceder permissões para os roles anon e authenticated
GRANT SELECT ON public.redirect_links TO anon;
GRANT ALL PRIVILEGES ON public.redirect_links TO authenticated;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_redirect_links_updated_at 
    BEFORE UPDATE ON public.redirect_links 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();