import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testSupabaseFetch() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('URL completa:', url);
  console.log('Key:', key?.substring(0, 20) + '...');
  
  if (!url || !key) {
    console.error('Variáveis de ambiente não encontradas');
    return;
  }
  
  try {
    console.log('Testando fetch direto...');
    
    const response = await fetch(`${url}/rest/v1/redirect_links?select=*`, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('Data:', data);
    
  } catch (error) {
    console.error('Erro no fetch:', error);
    
    // Tentar com configurações diferentes
    try {
      console.log('Tentando com configurações de TLS...');
      
      // Desabilitar verificação SSL temporariamente para teste
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      
      const response2 = await fetch(`${url}/rest/v1/redirect_links?select=*`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Status (sem SSL):', response2.status);
      const data2 = await response2.text();
      console.log('Data (sem SSL):', data2);
      
    } catch (error2) {
      console.error('Erro mesmo sem SSL:', error2);
    }
  }
}

testSupabaseFetch().catch(console.error);