import { Router, Request, Response } from 'express';
import { readCheckoutStore, setCheckoutLink, deleteCheckoutLink } from '../utils/jsonStore.js';

const router = Router();

function isAuthorized(req: Request): boolean {
  const token = process.env.ADMIN_TOKEN || '';
  const auth = req.headers['authorization'] || '';
  const provided = Array.isArray(auth) ? auth[0] : auth;
  const bearer = provided.startsWith('Bearer ') ? provided.substring(7) : provided;
  return token && bearer && bearer === token;
}

router.use((req, res, next) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

// GET current store
router.get('/checkout', (req: Request, res: Response) => {
  const store = readCheckoutStore();
  res.json(store);
});

// PUT set a link
router.put('/checkout/link', (req: Request, res: Response) => {
  const { key, qty, url } = req.body || {};
  if (!key || !url) {
    return res.status(400).json({ error: 'missing key or url' });
  }
  const finalKey = qty ? `${key}.${qty}` : `${key}.default`;
  const store = setCheckoutLink(finalKey, url);
  res.json({ ok: true, store });
});

// DELETE remove a link
router.delete('/checkout/link', (req: Request, res: Response) => {
  const { key, qty } = req.body || {};
  if (!key) {
    return res.status(400).json({ error: 'missing key' });
  }
  const finalKey = qty ? `${key}.${qty}` : `${key}.default`;
  const store = deleteCheckoutLink(finalKey);
  res.json({ ok: true, store });
});

export default router;