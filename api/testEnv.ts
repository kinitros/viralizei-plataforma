import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('=== TESTE DE VARIÁVEIS DE AMBIENTE ===');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_URL length:', process.env.SUPABASE_URL?.length);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 50) + '...');

// Verificar se há caracteres especiais
const url = process.env.SUPABASE_URL;
if (url) {
  console.log('URL bytes:', Array.from(url).map(c => c.charCodeAt(0)));
  console.log('URL includes supabase.co:', url.includes('supabase.co'));
  console.log('URL startsWith https:', url.startsWith('https://'));
}

// Tentar fazer um teste de DNS simples
import { lookup } from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(lookup);

async function testDNS() {
  try {
    const result = await dnsLookup('hegbxjevmcjoawdbxjll.supabase.co');
    console.log('DNS lookup resultado:', result);
  } catch (error) {
    console.error('DNS lookup erro:', error);
  }
}

testDNS();