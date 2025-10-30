import type { Handler, HandlerEvent } from '@netlify/functions';
import { requireAdmin, createErrorResponse, createSuccessResponse, handleCors } from './utils/auth.js';

// Simplified storage for Netlify Functions
interface RedirectLink {
  id: string;
  serviceKey: string;
  quantity?: number;
  url: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage as fallback
let memoryStorage: RedirectLink[] = [];

const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    const method = event.httpMethod;
    const path = event.path;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Remove 'api' and 'redirect-links' from path segments
    const relevantSegments = pathSegments.slice(2);
    
    switch (method) {
      case 'GET':
        if (relevantSegments.length === 0) {
          return await handleGetAllLinks(event);
        } else if (relevantSegments[0] === 'find') {
          return await handleFindLink(event);
        }
        break;
        
      case 'POST':
        if (relevantSegments.length === 0) {
          return await handleCreateLink(event);
        }
        break;
        
      case 'PUT':
        if (relevantSegments.length === 1) {
          return await handleUpdateLink(event, relevantSegments[0]);
        }
        break;
        
      case 'DELETE':
        if (relevantSegments.length === 1) {
          return await handleDeleteLink(event, relevantSegments[0]);
        }
        break;
    }

    return createErrorResponse(404, 'Endpoint não encontrado');
  } catch (error) {
    console.error('Erro na função redirect-links:', error);
    return createErrorResponse(500, 'Erro interno do servidor');
  }
};

async function handleGetAllLinks(event: HandlerEvent) {
  const authResult = requireAdmin(event);
  if (!authResult.isAuthorized) {
    return createErrorResponse(401, authResult.error || 'Não autorizado');
  }

  try {
    return createSuccessResponse({ data: memoryStorage });
  } catch (error) {
    console.error('Erro ao buscar links:', error);
    return createErrorResponse(500, 'Erro interno do servidor');
  }
}

async function handleCreateLink(event: HandlerEvent) {
  const authResult = requireAdmin(event);
  if (!authResult.isAuthorized) {
    return createErrorResponse(401, authResult.error || 'Não autorizado');
  }

  try {
    if (!event.body) {
      return createErrorResponse(400, 'Body da requisição é obrigatório');
    }

    const { serviceKey, quantity, url, description } = JSON.parse(event.body);

    // Validações
    if (!serviceKey || !url) {
      return createErrorResponse(400, 'serviceKey e url são obrigatórios');
    }

    // Validar URL
    try {
      new URL(url);
    } catch {
      return createErrorResponse(400, 'URL inválida');
    }

    // Verificar se já existe um link para este serviço e quantidade
    const existingLink = memoryStorage.find(link => 
      link.serviceKey === serviceKey && link.quantity === quantity
    );

    if (existingLink) {
      return createErrorResponse(409, 'Já existe um link configurado para este serviço e quantidade');
    }

    const newLink: RedirectLink = {
      id: Date.now().toString(),
      serviceKey,
      quantity: quantity || undefined,
      url,
      description: description || '',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryStorage.push(newLink);

    return createSuccessResponse({ 
      message: 'Link criado com sucesso',
      data: newLink 
    }, 201);
  } catch (error) {
    console.error('Erro ao criar link:', error);
    return createErrorResponse(500, 'Erro interno do servidor');
  }
}

async function handleUpdateLink(event: HandlerEvent, id: string) {
  const authResult = requireAdmin(event);
  if (!authResult.isAuthorized) {
    return createErrorResponse(401, authResult.error || 'Não autorizado');
  }

  try {
    if (!event.body) {
      return createErrorResponse(400, 'Body da requisição é obrigatório');
    }

    const { serviceKey, quantity, url, description, active } = JSON.parse(event.body);

    // Validar URL se fornecida
    if (url) {
      try {
        new URL(url);
      } catch {
        return createErrorResponse(400, 'URL inválida');
      }
    }

    const linkIndex = memoryStorage.findIndex(link => link.id === id);
    
    if (linkIndex === -1) {
      return createErrorResponse(404, 'Link não encontrado');
    }

    const updatedLink = {
      ...memoryStorage[linkIndex],
      ...(serviceKey && { serviceKey }),
      ...(quantity !== undefined && { quantity }),
      ...(url && { url }),
      ...(description !== undefined && { description }),
      ...(active !== undefined && { active }),
      updatedAt: new Date().toISOString()
    };

    memoryStorage[linkIndex] = updatedLink;

    return createSuccessResponse({
      message: 'Link atualizado com sucesso',
      data: updatedLink
    });
  } catch (error) {
    console.error('Erro ao atualizar link:', error);
    return createErrorResponse(500, 'Erro interno do servidor');
  }
}

async function handleDeleteLink(event: HandlerEvent, id: string) {
  const authResult = requireAdmin(event);
  if (!authResult.isAuthorized) {
    return createErrorResponse(401, authResult.error || 'Não autorizado');
  }

  try {
    const linkIndex = memoryStorage.findIndex(link => link.id === id);

    if (linkIndex === -1) {
      return createErrorResponse(404, 'Link não encontrado');
    }

    const deletedLink = memoryStorage[linkIndex];
    memoryStorage.splice(linkIndex, 1);

    return createSuccessResponse({
      message: 'Link deletado com sucesso',
      data: deletedLink
    });
  } catch (error) {
    console.error('Erro ao deletar link:', error);
    return createErrorResponse(500, 'Erro interno do servidor');
  }
}

async function handleFindLink(event: HandlerEvent) {
  try {
    const queryParams = event.queryStringParameters || {};
    const { serviceKey, quantity } = queryParams;

    if (!serviceKey) {
      return createErrorResponse(400, 'serviceKey é obrigatório');
    }

    const link = memoryStorage.find(link => 
      link.serviceKey === serviceKey && 
      (quantity ? link.quantity === parseInt(quantity as string) : !link.quantity) &&
      link.active
    );

    if (link) {
      return createSuccessResponse({ data: link });
    } else {
      return createErrorResponse(404, 'Link não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar link:', error);
    return createErrorResponse(500, 'Erro interno do servidor');
  }
}

export { handler };