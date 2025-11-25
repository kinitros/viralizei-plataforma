let followersDiscountPct = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ORDERBUMP_FOLLOWERS_DISCOUNT_PCT
  ? Number((import.meta as any).env.VITE_ORDERBUMP_FOLLOWERS_DISCOUNT_PCT)
  : 0.20;

export function setOrderBumpFollowersDiscountPct(pct: number): void {
  if (Number.isFinite(pct)) {
    followersDiscountPct = Math.max(0, Math.min(1, pct));
  }
}

export function getOrderBumpFollowersDiscountPct(): number {
  return followersDiscountPct;
}

