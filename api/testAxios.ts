import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testSupabaseAxios() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('URL completa:', url);
  console.log('Key:', key?.substring(0, 20) + '...');
  
  if (!url || !key) {
    console.error('Variáveis de ambiente não encontradas');
    return;
  }
  
  try {
    console.log('Testando axios...');
    
    // Tentar com IP direto primeiro
    const ipUrl = url?.replace('hegbxjevmcjoawdbxjll.supabase.co', '104.18.38.10');
    console.log('Testando com IP:', ipUrl);
    
    const response = await axios.get(`${ipUrl}/rest/v1/redirect_links?select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Host': 'hegbxjevmcjoawdbxjll.supabase.co'
      },
      timeout: 10000
    });
    
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    // Tentar criar um registro
    console.log('Testando criação...');
    const createResponse = await axios.post(`${url}/rest/v1/redirect_links`, {
      id: 'test-axios-' + Date.now(),
      service_key: 'test-axios',
      quantity: 100,
      url: 'https://example.com/test-axios',
      description: 'Teste com axios',
      active: true
    }, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      timeout: 10000
    });
    
    console.log('Criação - Status:', createResponse.status);
    console.log('Criação - Data:', createResponse.data);
    
  } catch (error: any) {
    console.error('Erro no axios:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testSupabaseAxios().catch(console.error);