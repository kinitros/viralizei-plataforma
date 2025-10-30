import type { Request, Response, NextFunction } from 'express';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const configured = process.env.ADMIN_REDIRECT_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!configured) {
    return res.status(500).json({ success: false, error: 'Senha admin não configurada (ADMIN_REDIRECT_PASSWORD ou ADMIN_PASSWORD)' });
  }
  const provided = (req.header('x-admin-password') || req.body?.password || req.query?.password || '').toString();
  if (provided !== configured) {
    return res.status(401).json({ success: false, error: 'Não autorizado' });
  }
  next();
}