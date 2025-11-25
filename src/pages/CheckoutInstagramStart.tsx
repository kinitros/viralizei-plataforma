import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AtSign, Shield, Sparkles, Star } from 'lucide-react';
import { resolveProductPrice } from '../lib/priceResolver';
import { useProductByServiceKey } from '../hooks/useProducts';
import { useNavigate, useSearchParams } from 'react-router-dom';

function normalizeUsername(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  // aceita @handle, url, ou apenas handle
  const fromUrl = trimmed.match(/(?:instagram\.com\/)\s*([A-Za-z0-9._]+)/i);
  const candidate = fromUrl?.[1] || trimmed.replace(/^@/, '');
  // remove quaisquer barras ou query da URL
  return candidate.split(/[/?#]/)[0];
}

const CheckoutInstagramStart: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const key = params.get('key') || '';
  const qty = params.get('qty') || params.get('qtty') || '';
  const price = params.get('price') || '';
  const [resolvedPrice, setResolvedPrice] = useState<number>(price ? Number(price) : 0);

  function formatBRL(n: number): string {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const { product } = useProductByServiceKey(key);
  const totalAmount = product ? product.price : (price ? Number(price) : 0);

  const serviceLabel = useMemo(() => {
    if (!key) return 'Serviço Selecionado';
    const parts = key.split('.');
    // instagram.followers.br -> Seguidores BR
    const type = parts[1];
    const region = parts[2];
    const typeLabel =
      type === 'followers' ? 'Seguidores' : type === 'likes' ? 'Curtidas' : 'Visualizações';
    const regionLabel = region === 'world' ? 'Mundiais' : region === 'br' ? 'BR' : region === 'reels' ? 'Reels' : region === 'stories' ? 'Stories' : '';
    return `${typeLabel}${regionLabel ? ' ' + regionLabel : ''}`;
  }, [key]);

  const onContinue = () => {
    const username = normalizeUsername(value);
    if (!username) {
      setError('Informe um @perfil válido');
      return;
    }
    if (!isPublic) {
      setError('Perfis privados causam falhas — torne público para prosseguir');
      return;
    }
    setError(null);
    const parts = key ? key.split('.') : [];
    const type = parts[1];
    const search = new URLSearchParams();
    if (key) search.set('key', key);
    if (qty) search.set('qty', qty);
    if (price) search.set('price', price);
    if (type === 'likes' || type === 'views') {
      // Fluxo com seleção de posts
      const postType = type === 'likes' ? 'likes' : 'views';
      search.set('type', postType);
      navigate(`/checkout/instagram/${encodeURIComponent(username)}/posts?${search.toString()}`);
    } else {
      // Fluxo padrão (seguidores)
      navigate(`/checkout/instagram/${encodeURIComponent(username)}?${search.toString()}`);
    }
  };

  // resolver preço do pacote a partir do serviceKey/qty quando não há price na URL
  useEffect(() => {
    const run = async () => {
      const fallback = price ? Number(price) : 0
      if (!key || !qty) {
        setResolvedPrice(fallback)
        return
      }
      const resolved = await resolveProductPrice(key, Number(qty), fallback)
      setResolvedPrice(resolved)
    }
    run()
  }, [key, qty, price])

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6">
      <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-600 text-white p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">Turbine seu perfil do Instagram 🚀</div>
          <div className="ml-auto hidden md:flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">Etapa 1</span>
            <span className="text-xs uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">Seguro</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-pink-600" />
              <span>Informe seu @perfil para começarmos</span>
            </div>
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-pink-300">
              <AtSign className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="seuusuario ou URL do perfil"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
              <button
                onClick={onContinue}
                className="hidden md:inline-flex bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Continuar
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                Meu perfil está público
              </label>
              <div className="hidden md:flex items-center gap-1 text-xs text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Verificação rápida e segura</span>
              </div>
            </div>
            {error && (
              <div className="mt-3 bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2 text-sm">{error}</div>
            )}
            <button
              onClick={onContinue}
              className="md:hidden mt-4 w-full bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Continuar
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6 md:sticky md:top-28 h-fit">
          <div className="text-lg font-semibold mb-2">Resumo do Pedido</div>
          <div className="text-sm text-gray-600">{serviceLabel}</div>
          {qty && <div className="text-sm text-gray-600">Quantidade: {qty}</div>}
          <div className="mt-4 border-t pt-4">
            <div className="text-sm text-gray-600">Valor total</div>
            <div className="text-xl font-bold">{formatBRL(resolvedPrice || 0)}</div>
          </div>
          <div className="mt-6 text-xs text-gray-500">Dica: perfis privados podem falhar na entrega. Torne-o público.</div>
        </div>
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl md:text-2xl font-bold">O que nossos clientes dizem</div>
          <div className="hidden md:flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Ana L.', handle: '@analima', text: 'Entrega rápida, perfil bombou em poucos dias!', rating: 5 },
            { name: 'Pedro R.', handle: '@pedrorn', text: 'Processo simples e seguro. Recomendo.', rating: 5 },
            { name: 'Camila S.', handle: '@camilas', text: 'Suporte excelente e resultado real.', rating: 5 },
          ].map((t, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.1 }} viewport={{ once: true }} className="bg-white/80 backdrop-blur rounded-2xl shadow p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-white font-semibold">
                  {t.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-gray-600">{t.handle}</div>
                </div>
                <div className="ml-auto flex items-center text-yellow-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-700">{t.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  );
};

export default CheckoutInstagramStart;
