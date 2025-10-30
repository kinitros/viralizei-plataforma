import type { Handler, HandlerEvent } from '@netlify/functions';
import { createErrorResponse, createSuccessResponse, handleCors } from './utils/auth.js';

const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    const method = event.httpMethod;
    const path = event.path;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Remove 'api' and 'auth' from path segments
    const relevantSegments = pathSegments.slice(2);
    
    if (method === 'POST') {
      switch (relevantSegments[0]) {
        case 'register':
          return await handleRegister(event);
        case 'login':
          return await handleLogin(event);
        case 'logout':
          return await handleLogout(event);
      }
    }

    return createErrorResponse(404, 'Endpoint não encontrado');
  } catch (error) {
    console.error('Erro na função auth:', error);
    return createErrorResponse(500, 'Erro interno do servidor');
  }
};

async function handleRegister(event: HandlerEvent) {
  // TODO: Implement register logic
  return createErrorResponse(501, 'Funcionalidade de registro não implementada');
}

async function handleLogin(event: HandlerEvent) {
  // TODO: Implement login logic
  return createErrorResponse(501, 'Funcionalidade de login não implementada');
}

async function handleLogout(event: HandlerEvent) {
  // TODO: Implement logout logic
  return createErrorResponse(501, 'Funcionalidade de logout não implementada');
}

export { handler };