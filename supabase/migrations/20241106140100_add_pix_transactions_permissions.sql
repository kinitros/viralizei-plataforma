-- Configurar RLS e permissões para tabela pix_transactions
ALTER TABLE pix_transactions ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Permitir leitura pública" ON pix_transactions
    FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção pública" ON pix_transactions
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir atualização pública" ON pix_transactions
    FOR UPDATE
    USING (true);

-- Garantir permissões
GRANT SELECT ON pix_transactions TO anon, authenticated;
GRANT INSERT ON pix_transactions TO anon, authenticated;
GRANT UPDATE ON pix_transactions TO anon, authenticated;