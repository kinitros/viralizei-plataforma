export async function openCheckout(key: string, qty?: number) {
  try {
    const params = new URLSearchParams({ key });
    if (qty) params.set('qty', String(qty));
    const res = await fetch(`/api/checkout/link?${params.toString()}`);
    const data = await res.json();
    if (!data?.success || !data?.url) {
      alert('Link de checkout não disponível. Entre em contato com o suporte.');
      return;
    }
    window.location.href = data.url as string;
  } catch (e) {
    alert('Erro ao abrir o checkout. Tente novamente mais tarde.');
  }
}