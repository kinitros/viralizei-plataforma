-- Tabela de transações PIX
CREATE TABLE pix_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Dados do cliente
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_document TEXT,
    
    -- Dados do pedido
    order_id TEXT UNIQUE NOT NULL,
    instagram_username TEXT NOT NULL,
    service_type TEXT NOT NULL, -- 'followers', 'likes', 'views'
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Dados do PIX
    pix_id TEXT,
    pix_qr_code TEXT,
    pix_qr_code_base64 TEXT,
    pix_copy_paste_code TEXT,
    pix_expiration_at TIMESTAMP WITH TIME ZONE,
    
    -- Status e controle
    status TEXT NOT NULL DEFAULT 'Não Pago', -- 'Não Pago', 'Pago', 'Expirado', 'Cancelado'
    pushin_pay_transaction_id TEXT,
    webhook_received_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para performance
    CONSTRAINT pix_transactions_order_id_unique UNIQUE (order_id),
    CONSTRAINT pix_transactions_pix_id_unique UNIQUE (pix_id)
);

-- Índices para consultas frequentes
CREATE INDEX idx_pix_transactions_status ON pix_transactions(status);
CREATE INDEX idx_pix_transactions_customer_email ON pix_transactions(customer_email);
CREATE INDEX idx_pix_transactions_instagram_username ON pix_transactions(instagram_username);
CREATE INDEX idx_pix_transactions_created_at ON pix_transactions(created_at DESC);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pix_transactions_updated_at 
    BEFORE UPDATE ON pix_transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Permissões para anon e authenticated
GRANT SELECT ON pix_transactions TO anon;
GRANT INSERT ON pix_transactions TO anon;
GRANT UPDATE ON pix_transactions TO authenticated;
GRANT SELECT ON pix_transactions TO authenticated;