import type { Handler, HandlerEvent } from '@netlify/functions';
import { requireAdmin, createErrorResponse, createSuccessResponse, handleCors } from './utils/auth.js';
import { StorageProviderFactory } from './utils/storage.js';

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
    const provider = StorageProviderFactory.getProvider();
    const links = await provider.getAllLinks();
    
    return createSuccessResponse({ data: links });
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

    const provider = StorageProviderFactory.getProvider();
    
    // Verificar se já existe um link para este serviço e quantidade
    const existingLink = await provider.findLink(serviceKey, quantity);

    if (existingLink) {
      return createErrorResponse(409, 'Já existe um link configurado para este serviço e quantidade');
    }

    const newLink = await provider.createLink({
      serviceKey,
      quantity: quantity || undefined,
      url,
      description: description || '',
      active: true
    });

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

    const provider = StorageProviderFactory.getProvider();
    
    const updatedLink = await provider.updateLink(id, {
      ...(serviceKey && { serviceKey }),
      ...(quantity !== undefined && { quantity }),
      ...(url && { url }),
      ...(description !== undefined && { description }),
      ...(active !== undefined && { active })
    });

    if (!updatedLink) {
      return createErrorResponse(404, 'Link não encontrado');
    }

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
    const provider = StorageProviderFactory.getProvider();
    const deletedLink = await provider.deleteLink(id);

    if (!deletedLink) {
      return createErrorResponse(404, 'Link não encontrado');
    }

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

    const provider = StorageProviderFactory.getProvider();
    const link = await provider.findLink(
      serviceKey as string, 
      quantity ? parseInt(quantity as string) : undefined
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