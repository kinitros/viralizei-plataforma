import { Router, type Request, type Response } from 'express';
import { readCheckoutStore } from '../utils/jsonStore.js';

const router = Router();

/**
 * GET /api/checkout/link?key=instagram.followers.br&qty=100
 * Resolução de link: primeiro store JSON admin, depois variáveis de ambiente.
 * Padrão de chaves:
 * - Store: `${key}.${qty}` ou `${key}.default`
 * - Env: CHECKOUT_<KEY>_<QTY> ou CHECKOUT_<KEY>_DEFAULT
 */
router.get('/link', async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, qty } = req.query as { key?: string; qty?: string };
    if (!key) {
      res.status(400).json({ success: false, error: 'Parâmetro "key" é obrigatório' });
      return;
    }

    const finalKey = qty ? `${key}.${qty}` : `${key}.default`;
    const store = readCheckoutStore();
    const adminUrl = store.links[finalKey];

    if (adminUrl) {
      res.status(200).json({ success: true, url: adminUrl, source: 'admin' });
      return;
    }

    const baseKey = `CHECKOUT_${key.replace(/\./g, '_').toUpperCase()}`;
    const specificKey = qty ? `${baseKey}_${qty}` : undefined;
    const defaultKey = `${baseKey}_DEFAULT`;

    const envUrl = (specificKey && process.env[specificKey]) || process.env[defaultKey];

    if (!envUrl) {
      res.status(404).json({ success: false, error: 'Link de checkout não configurado' });
      return;
    }

    res.status(200).json({ success: true, url: envUrl, source: 'env' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Erro interno ao obter link de checkout' });
  }
});

export default router;