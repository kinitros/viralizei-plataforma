import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';
import { PixPaymentModal } from '../components/PixPaymentModal';
import { motion } from 'framer-motion';
import { Sparkles, UserPlus, Heart, Eye } from 'lucide-react';
import { getOrderBumpFollowersDiscountPct } from '../lib/orderBump';
import { resolveProductPrice } from '../lib/priceResolver';
import { pixService, CreatePixRequest } from '../services/pix';
import { toast } from 'sonner';

type Profile = {
  username: string;
  full_name?: string;
  profile_pic_url?: string;
  followers?: number;
  following?: number;
  posts?: number;
  is_private?: boolean;
};

type PostItem = {
  id: string;
  permalink?: string;
  caption?: string;
  is_video?: boolean;
  like_count?: number | null;
  comment_count?: number | null;
  taken_at?: number | string | null;
  thumbnail_url?: string;
};

function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function CheckoutInstagramPosts() {
  const navigate = useNavigate();
  const { username: routeUsername } = useParams();
  const [searchParams] = useSearchParams();

  const type = (searchParams.get('type') || 'likes') as 'likes' | 'views';
  const qty = parseInt(searchParams.get('qty') || '0', 10) || 0;
  const key = searchParams.get('key') || '';
  const price = parseFloat(searchParams.get('price') || '0') || 0;

  const username = (routeUsername || '').replace(/^@/, '');

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeBase64: string;
    copyPasteCode: string;
    orderId: string;
    expirationAt: string;
  } | null>(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
  });
  const [bumpFollowers, setBumpFollowers] = useState(false);
  const [bumpLikes, setBumpLikes] = useState(false);
  const [bumpViews, setBumpViews] = useState(false);
  const [followersPrice, setFollowersPrice] = useState<number>(0);
  const [likesResolvedPrice, setLikesResolvedPrice] = useState<number>(0);
  const [viewsPrice, setViewsPrice] = useState<number>(0);

  const followersDiscountPct = getOrderBumpFollowersDiscountPct();
  const followersBumpAmount = useMemo(() => bumpFollowers ? followersPrice * (1 - followersDiscountPct) : 0, [bumpFollowers, followersPrice, followersDiscountPct]);
  const likesBumpAmount = useMemo(() => bumpLikes ? likesResolvedPrice : 0, [bumpLikes, likesResolvedPrice]);
  const viewsBumpAmount = useMemo(() => bumpViews ? viewsPrice : 0, [bumpViews, viewsPrice]);
  const grandTotal = useMemo(() => basePrice + followersBumpAmount + likesBumpAmount + viewsBumpAmount, [basePrice, followersBumpAmount, likesBumpAmount, viewsBumpAmount]);
  const grandTotalFormatted = useMemo(() => formatCurrencyBRL(grandTotal), [grandTotal]);

  const [basePrice, setBasePrice] = useState<number>(price);
  const totalFormatted = useMemo(() => formatCurrencyBRL(grandTotal), [grandTotal]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [pRes, postsRes] = await Promise.all([
          fetch(`/api/instagram/profile?username=${encodeURIComponent(username)}`),
          fetch(`/api/instagram/posts?username=${encodeURIComponent(username)}&count=24`),
        ]);
        const pJson = await pRes.json();
        const postsJson = await postsRes.json();
        console.log('[CheckoutInstagramPosts] profile response:', pJson);
        console.log('[CheckoutInstagramPosts] posts response:', postsJson);
        if (!mounted) return;
        if (!pJson?.success) throw new Error(pJson?.error || 'Falha ao buscar perfil');
        if (!postsJson?.success) throw new Error(postsJson?.error || 'Falha ao buscar posts');
        const d: any = pJson.data || {};
        const normalizedProfile: Profile = {
          username: d.username || username,
          full_name: d.full_name || '',
          profile_pic_url: d.profile_pic_url || '',
          followers: typeof d.followers_count === 'number' ? d.followers_count : d.followers,
          following: typeof d.following_count === 'number' ? d.following_count : d.following,
          posts: typeof d.posts === 'number' ? d.posts : undefined,
          is_private: typeof d.is_private === 'boolean' ? d.is_private : Boolean(d.isPrivate),
        };
        setProfile(normalizedProfile);
        setPosts(Array.isArray(postsJson.data) ? postsJson.data : []);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [username]);

  useEffect(() => {
    async function resolve() {
      const fallback = price;
      if (!key || !qty) {
        setBasePrice(fallback);
        return;
      }
      const resolved = await resolveProductPrice(key, qty, fallback);
      setBasePrice(resolved);
    }
    resolve();
  }, [key, qty, price]);

  useEffect(() => {
    async function loadBumpPrices() {
      try {
        const parts = (key || '').split('.');
        const regionPart = parts[2] || 'world';
        const followersKey = `instagram.followers.${regionPart}`;
        const likesKey = `instagram.likes.${regionPart}`;
        let viewsKey = 'instagram.views.reels';
        if (key.includes('views.reels')) viewsKey = 'instagram.views.reels';
        else if (key.includes('views.stories')) viewsKey = 'instagram.views.stories';

        const [folResolved, likesResolved, viewsResolved] = await Promise.all([
          resolveProductPrice(followersKey, qty, 0),
          resolveProductPrice(likesKey, qty, 0),
          resolveProductPrice(viewsKey, qty, 0),
        ]);
        setFollowersPrice(folResolved || 0);
        setLikesResolvedPrice(likesResolved || 0);
        setViewsPrice(viewsResolved || 0);
      } catch (e) {
        setFollowersPrice(0);
        setLikesResolvedPrice(0);
        setViewsPrice(0);
      }
    }
    loadBumpPrices();
  }, [qty, key]);

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleBack() {
    navigate(`/checkout/instagram?key=${encodeURIComponent(key)}&qty=${qty}&price=${price}`);
  }

  async function handlePay() {
    if (selected.length === 0) {
      toast.error('Selecione pelo menos 1 publicação para continuar.');
      return;
    }

    if (!customerData.name || !customerData.email) {
      toast.error('Preencha seus dados para continuar.');
      return;
    }

    try {
      const pixRequest: CreatePixRequest = {
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_document: customerData.document,
        instagram_username: username,
        service_type: type,
        quantity: qty,
        unit_price: basePrice / qty,
        total_amount: grandTotal,
      };

      const response = await pixService.createPixCharge(pixRequest);

      if (response.success && response.data) {
        setPixData({
          qrCode: response.data.qr_code,
          qrCodeBase64: response.data.qr_code_base64,
          copyPasteCode: response.data.copy_paste_code,
          orderId: response.data.order_id,
          expirationAt: response.data.expiration_at,
        });
        setShowPixModal(true);
      } else {
        toast.error(response.error || 'Erro ao criar cobrança PIX');
      }
    } catch (error) {
      console.error('Erro ao criar cobrança PIX:', error);
      toast.error('Erro ao processar pagamento');
    }
  }

  function handlePaymentConfirmed() {
    setShowPixModal(false);
    navigate('/checkout/success', { 
      state: { 
        orderId: pixData?.orderId,
        amount: grandTotal,
        serviceType: type,
        quantity: qty,
        instagramUsername: username,
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="p-0.5 rounded-full bg-gradient-to-br from-yellow-300 to-pink-500">
              <img
                src={profile?.profile_pic_url ? `/api/instagram/profile_pic_proxy?url=${encodeURIComponent(profile.profile_pic_url)}` : '/favicon.svg'}
                alt={profile?.username || 'perfil'}
                className="w-14 h-14 rounded-full bg-white object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="text-lg md:text-xl font-bold">{type === 'likes' ? 'Checkout de Curtidas' : 'Checkout de Visualizações'} no Instagram</div>
              <div className="text-xs md:text-sm opacity-90">@{username}</div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">Oferta</span>
              <span className="text-xs uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">Seguro</span>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">Carregando perfil e publicações…</div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded mb-6 text-center">{error}</div>
        )}

        {!loading && !error && profile && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <section className="md:col-span-2 bg-white rounded-2xl shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={profile.profile_pic_url ? `/api/instagram/profile_pic_proxy?url=${encodeURIComponent(profile.profile_pic_url)}` : '/favicon.svg'}
                  alt={profile.username}
                  className="w-14 h-14 rounded-full border"
                  loading="lazy"
                  onError={(e) => {
                    console.warn('[CheckoutInstagramPosts] profile image failed via proxy, fallback to favicon', profile);
                    (e.target as HTMLImageElement).src = '/favicon.svg';
                  }}
                />
                <div>
                  <div className="font-medium">{profile.full_name || profile.username}</div>
                  <div className="text-sm text-gray-600">@{profile.username}</div>
                </div>
                <div className="ml-auto text-sm text-gray-600">
                  {profile.followers ? (
                    <span>{profile.followers.toLocaleString('pt-BR')} seguidores</span>
                  ) : (
                    <span>Perfil público</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Selecione as publicações</h2>
                <button
                  className="text-sm text-indigo-600 hover:underline"
                  onClick={() => setSelected(posts.map((p) => p.id))}
                >
                  Selecionar todas
                </button>
              </div>

              {posts.length === 0 && (
                <div className="text-center text-gray-600">Nenhuma publicação encontrada.</div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => toggleSelect(post.id)}
                    className={`relative rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow transition-all ${
                      selected.includes(post.id) ? 'ring-2 ring-pink-500' : 'hover:border-pink-300'
                    }`}
                    title={post.caption || ''}
                  >
                    <img
                      src={post.thumbnail_url || '/favicon.svg'}
                      alt={post.caption || post.permalink || post.id}
                      className="w-full aspect-square object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/favicon.svg';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-white/80 backdrop-blur rounded-full px-3 py-1 text-xs text-gray-700">
                      {post.is_video ? 'Vídeo' : 'Foto'}
                    </div>
                    {selected.includes(post.id) && (
                      <div className="absolute inset-0 bg-pink-600/10" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <aside className="bg-white/80 backdrop-blur rounded-2xl shadow p-6 md:sticky md:top-28 h-fit">
              <div className="mb-4">
                <div className="text-sm text-gray-600">Serviço</div>
                <div className="font-medium">
                  {type === 'likes' ? 'Curtidas' : 'Visualizações'} no Instagram
                </div>
                <div className="text-sm text-gray-600">Quantidade: {qty}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600">Publicações selecionadas</div>
                <div className="font-medium">{selected.length}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600">Valor total</div>
                <div className="text-xl font-semibold">{totalFormatted}</div>
              </div>

              <div className="mb-6 space-y-4">
                <div className="border border-pink-300 rounded-2xl p-4 bg-white">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-white">
                      <UserPlus className="h-7 w-7" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Adicionar {qty} Seguidores Mundiais Instagram ao meu pedido</div>
                      <div className="text-teal-600 text-sm">Oferta Exclusiva!</div>
                      <div className="mt-1 text-sm">
                        <span className="line-through text-gray-400 mr-2">{formatCurrencyBRL(followersPrice)}</span>
                        <span className="font-bold">{formatCurrencyBRL(followersPrice * (1 - followersDiscountPct))}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBumpFollowers(!bumpFollowers)}
                      className={`ml-4 rounded px-4 py-2 font-semibold ${bumpFollowers ? 'bg-gray-200 text-gray-800' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
                    >
                      {bumpFollowers ? 'Remover' : 'Adicionar'}
                    </button>
                  </div>
                </div>

                <div className="border border-pink-300 rounded-2xl p-4 bg-white">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-white">
                      <Heart className="h-7 w-7" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Adicionar {qty} Curtidas Mundiais Instagram ao meu pedido</div>
                      <div className="text-teal-600 text-sm">Oferta Exclusiva!</div>
                      <div className="mt-1 text-sm">
                        <span className="font-bold">{formatCurrencyBRL(likesResolvedPrice)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBumpLikes(!bumpLikes)}
                      className={`ml-4 rounded px-4 py-2 font-semibold ${bumpLikes ? 'bg-gray-200 text-gray-800' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
                    >
                      {bumpLikes ? 'Remover' : 'Adicionar'}
                    </button>
                  </div>
                </div>

                <div className="border border-pink-300 rounded-2xl p-4 bg-white">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-white">
                      <Eye className="h-7 w-7" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Adicionar {qty} Visualizações Instagram ao meu pedido</div>
                      <div className="text-teal-600 text-sm">Oferta Exclusiva!</div>
                      <div className="mt-1 text-sm">
                        <span className="font-bold">{formatCurrencyBRL(viewsPrice)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBumpViews(!bumpViews)}
                      className={`ml-4 rounded px-4 py-2 font-semibold ${bumpViews ? 'bg-gray-200 text-gray-800' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
                    >
                      {bumpViews ? 'Remover' : 'Adicionar'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Formulário de dados do cliente */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF (opcional)
                  </label>
                  <input
                    type="text"
                    value={customerData.document}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, document: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <button
                onClick={handlePay}
                className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-full shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={selected.length === 0 || !customerData.name || !customerData.email}
              >
                Pagar com PIX
              </button>

              <button
                onClick={handleBack}
                className="w-full mt-3 text-pink-600 hover:underline"
              >
                Voltar
              </button>

              <div className="mt-6 text-xs text-gray-600">
                Mantenha o perfil público durante o processo. Não altere o usuário.
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      
      <PixPaymentModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        pixData={pixData}
        onPaymentConfirmed={handlePaymentConfirmed}
      />
    </div>
  );
}
