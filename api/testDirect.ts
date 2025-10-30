import axios from 'axios';

async function testSupabaseDirect() {
  const url = 'https://hegbxjevmcjoawdbxjll.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZ2J4amV2bWNqb2F3ZGJ4amxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTgyNTk2NSwiZXhwIjoyMDc3NDAxOTY1fQ.-0cXgphROg1SkXxTwfcklqiviuxTZXnnPUNct2NwPz0';
  
  console.log('URL:', url);
  console.log('Key length:', key.length);
  
  try {
    console.log('Testando axios com valores diretos...');
    
    const response = await axios.get(`${url}/rest/v1/redirect_links?select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    // Tentar criar um registro
    console.log('Testando criação...');
    const createResponse = await axios.post(`${url}/rest/v1/redirect_links`, {
      id: crypto.randomUUID(),
      service_key: 'test-direct',
      quantity: 100,
      url: 'https://example.com/test-direct',
      description: 'Teste direto',
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

testSupabaseDirect().catch(console.error);