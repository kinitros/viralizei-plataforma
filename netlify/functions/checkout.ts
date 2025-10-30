import type { Handler, HandlerEvent } from '@netlify/functions';
import { createErrorResponse, createSuccessResponse, handleCors } from './utils/auth.js';

// Import the JSON store utility
import { readCheckoutStore } from '../../api/utils/jsonStore.js';

const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    const method = event.httpMethod;
    const path = event.path;
    
    if (method === 'GET' && path.includes('/link')) {
      return await handleGetCheckoutLink(event);
    }

    return createErrorResponse(404, 'Endpoint não encontrado');
  } catch (error) {
    console.error('Erro na função checkout:', error);
    return createErrorResponse(500, 'Erro interno do servidor');
  }
};

async function handleGetCheckoutLink(event: HandlerEvent) {
  try {
    const queryParams = event.queryStringParameters || {};
    const { key, qty } = queryParams;
    
    if (!key) {
      return createErrorResponse(400, 'Parâmetro "key" é obrigatório');
    }

    const finalKey = qty ? `${key}.${qty}` : `${key}.default`;
    const store = readCheckoutStore();
    const adminUrl = store.links[finalKey];

    if (adminUrl) {
      return createSuccessResponse({ 
        url: adminUrl, 
        source: 'admin' 
      });
    }

    const baseKey = `CHECKOUT_${key.replace(/\./g, '_').toUpperCase()}`;
    const specificKey = qty ? `${baseKey}_${qty}` : undefined;
    const defaultKey = `${baseKey}_DEFAULT`;

    const envUrl = (specificKey && process.env[specificKey]) || process.env[defaultKey];

    if (!envUrl) {
      return createErrorResponse(404, 'Link de checkout não configurado');
    }

    return createSuccessResponse({ 
      url: envUrl, 
      source: 'env' 
    });
  } catch (error) {
    console.error('Erro ao obter link de checkout:', error);
    return createErrorResponse(500, 'Erro interno ao obter link de checkout');
  }
}

export { handler };