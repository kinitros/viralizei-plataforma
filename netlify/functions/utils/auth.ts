import type { HandlerEvent } from '@netlify/functions';

export interface AuthResult {
  isAuthorized: boolean;
  error?: string;
}

export function requireAdmin(event: HandlerEvent): AuthResult {
  const configured = process.env.ADMIN_REDIRECT_PASSWORD || process.env.ADMIN_PASSWORD;
  
  if (!configured) {
    return {
      isAuthorized: false,
      error: 'Senha admin não configurada (ADMIN_REDIRECT_PASSWORD ou ADMIN_PASSWORD)'
    };
  }

  // Verificar header de autorização
  const authHeader = event.headers['x-admin-password'] || event.headers['X-Admin-Password'];
  
  // Verificar body (para POST/PUT)
  let bodyPassword = '';
  if (event.body) {
    try {
      const body = JSON.parse(event.body);
      bodyPassword = body.password || '';
    } catch {
      // Ignore JSON parse errors
    }
  }

  // Verificar query parameters
  const queryParams = event.queryStringParameters || {};
  const queryPassword = queryParams.password || '';

  const provided = (authHeader || bodyPassword || queryPassword).toString();

  if (provided !== configured) {
    return {
      isAuthorized: false,
      error: 'Não autorizado'
    };
  }

  return { isAuthorized: true };
}

export function createErrorResponse(status: number, message: string) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({
      success: false,
      message
    })
  };
}

export function createSuccessResponse(data: any, status: number = 200) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({
      success: true,
      ...data
    })
  };
}

export function handleCors(event: HandlerEvent) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }
  return null;
}