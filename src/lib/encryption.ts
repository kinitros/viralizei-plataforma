// Util simples de ofuscação Base64 para parâmetros de checkout
// Nunca armazene segredos aqui; isto é apenas ofuscação, não segurança.

export interface PackedCheckoutData {
  key: string;
  qty: string | number;
  price: string | number | null;
}

const hasWindow = typeof window !== 'undefined' && !!(window as any).btoa;

export const toBase64 = (str: string): string => {
  try {
    if (hasWindow) return (window as any).btoa(unescape(encodeURIComponent(str)));
    return Buffer.from(str, 'utf-8').toString('base64');
  } catch {
    return '';
  }
};

export const fromBase64 = (b64: string): string | null => {
  try {
    if (hasWindow) return decodeURIComponent(escape((window as any).atob(b64)));
    return Buffer.from(b64, 'base64').toString('utf-8');
  } catch {
    return null;
  }
};

// Formato: "key|qty|price"
export const packCheckoutData = (data: PackedCheckoutData): string => {
  const safeKey = String(data.key || '').replace(/\|/g, '-');
  const safeQty = String(data.qty ?? '0');
  const safePrice = data.price == null ? '' : String(data.price);
  return toBase64(`${safeKey}|${safeQty}|${safePrice}`);
};

export const unpackCheckoutData = (packed: string): PackedCheckoutData | null => {
  const decoded = fromBase64(packed);
  if (!decoded) return null;
  const parts = decoded.split('|');
  if (parts.length < 3) return null;
  const [key, qty, price] = parts;
  if (key == null) return null;
  return { key, qty, price: price === '' ? null : price };
};