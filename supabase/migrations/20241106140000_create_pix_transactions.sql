-- Tabela de transações PIX
CREATE TABLE pix_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_document TEXT,
  instagram_username TEXT NOT NULL,
  service_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  pix_id TEXT,
  qr_code TEXT,
  qr_code_base64 TEXT,
  copy_paste_code TEXT,
  expiration_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'Não Pago',
  paid_at TIMESTAMP WITH TIME ZONE,
  webhook_received_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_pix_transactions_order_id ON pix_transactions(order_id);
CREATE INDEX idx_pix_transactions_status ON pix_transactions(status);
CREATE INDEX idx_pix_transactions_customer_email ON pix_transactions(customer_email);
CREATE INDEX idx_pix_transactions_created_at ON pix_transactions(created_at);

-- RLS (Row Level Security)
ALTER TABLE pix_transactions ENABLE ROW LEVEL SECURITY;

-- Permissões para roles anon e authenticated
GRANT SELECT ON pix_transactions TO anon, authenticated;
GRANT INSERT ON pix_transactions TO anon, authenticated;
GRANT UPDATE ON pix_transactions TO anon, authenticated;