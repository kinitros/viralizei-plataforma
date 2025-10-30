import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/adminAuth.js';
import { StorageProviderFactory } from '../providers/StorageProviderFactory.js';

const router = Router();

// GET /api/redirect-links - Listar todos os links
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const provider = StorageProviderFactory.getProvider();
    const links = await provider.getAllLinks();
    
    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    console.error('Erro ao buscar links:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/redirect-links - Criar novo link
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { serviceKey, quantity, url, description } = req.body;

    // Validações
    if (!serviceKey || !url) {
      return res.status(400).json({
        success: false,
        message: 'serviceKey e url são obrigatórios'
      });
    }

    // Validar URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'URL inválida'
      });
    }

    const provider = StorageProviderFactory.getProvider();
    
    // Verificar se já existe um link para este serviço e quantidade
    const existingLink = await provider.findLink(serviceKey, quantity);

    if (existingLink) {
      return res.status(409).json({
        success: false,
        message: 'Já existe um link configurado para este serviço e quantidade'
      });
    }

    const newLink = await provider.createLink({
      serviceKey,
      quantity: quantity || undefined,
      url,
      description: description || '',
      active: true
    });

    res.status(201).json({
      success: true,
      message: 'Link criado com sucesso',
      data: newLink
    });
  } catch (error) {
    console.error('Erro ao criar link:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/redirect-links/:id - Atualizar link
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { serviceKey, quantity, url, description, active } = req.body;

    // Validar URL se fornecida
    if (url) {
      try {
        new URL(url);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'URL inválida'
        });
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
      return res.status(404).json({
        success: false,
        message: 'Link não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Link atualizado com sucesso',
      data: updatedLink
    });
  } catch (error) {
    console.error('Erro ao atualizar link:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/redirect-links/:id - Deletar link
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const provider = StorageProviderFactory.getProvider();
    const deletedLink = await provider.deleteLink(id);

    if (!deletedLink) {
      return res.status(404).json({
        success: false,
        message: 'Link não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Link deletado com sucesso',
      data: deletedLink
    });
  } catch (error) {
    console.error('Erro ao deletar link:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/redirect-links/find - Buscar link específico
router.get('/find', async (req: Request, res: Response) => {
  try {
    const { serviceKey, quantity } = req.query;

    if (!serviceKey) {
      return res.status(400).json({
        success: false,
        message: 'serviceKey é obrigatório'
      });
    }

    const provider = StorageProviderFactory.getProvider();
    const link = await provider.findLink(
      serviceKey as string, 
      quantity ? parseInt(quantity as string) : undefined
    );

    if (link) {
      res.json({
        success: true,
        data: link
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Link não encontrado'
      });
    }
  } catch (error) {
    console.error('Erro ao buscar link:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;