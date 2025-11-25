-- Criar tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  service_key TEXT NOT NULL UNIQUE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2) CHECK (original_price >= 0),
  discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  network TEXT NOT NULL,
  service_type TEXT NOT NULL,
  region TEXT DEFAULT 'worldwide',
  description TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para buscas rápidas
CREATE INDEX idx_products_service_key ON products(service_key);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_network_service ON products(network, service_type);
CREATE INDEX idx_products_region ON products(region);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Função para obter preço com desconto
CREATE OR REPLACE FUNCTION get_discounted_price(product products)
RETURNS DECIMAL AS $$
BEGIN
    RETURN product.price * (1 - product.discount_percentage / 100.0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Grant permissions
GRANT ALL ON products TO authenticated;
GRANT SELECT ON products TO anon;