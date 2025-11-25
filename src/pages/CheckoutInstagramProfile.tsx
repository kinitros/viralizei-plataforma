import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, UserPlus, Heart, Eye } from 'lucide-react';
import { resolveProductPrice } from '../lib/priceResolver';
import { useParams, useSearchParams } from 'react-router-dom';
import { PixPaymentModal } from '../components/PixPaymentModal';
import { pixService } from '../services/pix';
import { useProductByServiceKey } from '../hooks/useProducts';
import { getOrderBumpFollowersDiscountPct } from '../lib/orderBump';
import { Product } from '../types/product';

interface ProfileData {
  username: string;
  full_name: string;
  biography: string;
  profile_pic_url: string;
  followers_count: number | null;
  following_count: number | null;
  is_private: boolean;
  is_verified: boolean;
}

function formatBRL(n: number): string {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const CheckoutInstagramProfile: React.FC = () => {
  const { username = '' } = useParams();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_document: '',
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pixModalData, setPixModalData] = useState<{
    qrCode: string;
    qrCodeBase64: string;
    copyPasteCode: string;
    orderId: string;
    expirationAt: string;
  } | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [bumpFollowers, setBumpFollowers] = useState(false);
  const [bumpLikes, setBumpLikes] = useState(false);
  const [bumpViews, setBumpViews] = useState(false);
  const [likesPrice, setLikesPrice] = useState<number>(0);
  const [viewsPrice, setViewsPrice] = useState<number>(0);

  const qty = Number(params.get('qty') || '0');
  const key = params.get('key') || '';
  const price = params.get('price');

  // Buscar produto do Supabase
  const { product, loading: productLoading, error: productError } = useProductByServiceKey(key);

  const serviceLabel = useMemo(() => {
    if (product) {
      const regionLabel = product.region === 'brazil' ? 'BR' : product.region === 'worldwide' ? 'Mundiais' : '';
      const typeLabel = product.service_type === 'followers' ? 'Seguidores' : 
                       product.service_type === 'likes' ? 'Curtidas' : 'Visualizações';
      return `${typeLabel}${regionLabel ? ' ' + regionLabel : ''}`;
    }
    
    if (!key) return 'Detalhes do Serviço';
    const parts = key.split('.');
    const type = parts[1];
    const region = parts[2];
    const typeLabel =
      type === 'followers' ? 'Seguidores' : type === 'likes' ? 'Curtidas' : 'Visualizações';
    const regionLabel = region === 'world' ? 'Mundiais' : region === 'br' ? 'BR' : region === 'reels' ? 'Reels' : region === 'stories' ? 'Stories' : '';
    return `${typeLabel}${regionLabel ? ' ' + regionLabel : ''}`;
  }, [key, product]);

  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/instagram/profile?username=${encodeURIComponent(username)}`);
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || 'Falha na consulta');
        }
        if (active) setData(json.data as ProfileData);
      } catch (e: any) {
        if (active) setError(e?.message || 'Erro ao consultar perfil');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      active = false;
    };
  }, [username]);

  const contracted = qty || 0;
  const currentFollowers = data?.followers_count ?? null;
  const afterPurchase = currentFollowers !== null ? currentFollowers + contracted : contracted;
  
  const [displayPrice, setDisplayPrice] = useState<number>(price ? Number(price) : 0);
  useEffect(() => {
    const run = async () => {
      const fallback = price ? Number(price) : 0;
      if (!key || !qty) {
        setDisplayPrice(fallback);
        return;
      }
      const resolved = await resolveProductPrice(key, qty, fallback);
      setDisplayPrice(resolved);
    };
    run();
  }, [key, qty, price]);
  const followersDiscountPct = getOrderBumpFollowersDiscountPct();
  const totalAmount = displayPrice;
  const followersBumpAmount = useMemo(() => {
    const base = totalAmount;
    return bumpFollowers ? base * (1 - followersDiscountPct) : 0;
  }, [bumpFollowers, totalAmount, followersDiscountPct]);

  const bumpsAmount = useMemo(() => {
    return followersBumpAmount + (bumpLikes ? likesPrice : 0) + (bumpViews ? viewsPrice : 0);
  }, [followersBumpAmount, bumpLikes, likesPrice, bumpViews, viewsPrice]);

  const grandTotal = useMemo(() => {
    return totalAmount + bumpsAmount;
  }, [totalAmount, bumpsAmount]);

  useEffect(() => {
    const fetchBumpPrices = async () => {
      try {
        const likesRes = await fetch(`/api/products?network=instagram&serviceType=likes&region=worldwide&active=true`);
        const likesJson = await likesRes.json();
        const likesItems = Array.isArray(likesJson) ? likesJson : likesJson.data;
        const likeProduct = (likesItems || []).find((p: any) => p.quantity === qty && p.is_active);
        setLikesPrice(likeProduct ? likeProduct.price : 0);

        const viewsRes = await fetch(`/api/products?network=instagram&serviceType=views&region=worldwide&active=true`);
        const viewsJson = await viewsRes.json();
        const viewsItems = Array.isArray(viewsJson) ? viewsJson : viewsJson.data;
        const viewProduct = (viewsItems || []).find((p: any) => p.quantity === qty && p.is_active);
        setViewsPrice(viewProduct ? viewProduct.price : 0);
      } catch (e) {
        setLikesPrice(0);
        setViewsPrice(0);
      }
    };
    fetchBumpPrices();
  }, [qty]);
  
  // Validação do produto
  const [productValidation, setProductValidation] = useState<{
    valid: boolean;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (product && qty > 0) {
      // Validar se a quantidade e preço correspondem ao produto
      if (product.quantity !== qty) {
        setProductValidation({ 
          valid: false, 
          error: `Quantidade inválida. Produto disponível: ${product.quantity}` 
        });
      } else if (product.price !== displayPrice) {
        setProductValidation({ 
          valid: false, 
          error: `Preço inválido. Valor correto: R$ ${product.price.toFixed(2)}` 
        });
      } else if (!product.is_active) {
        setProductValidation({ 
          valid: false, 
          error: 'Produto indisponível no momento' 
        });
      } else {
        setProductValidation({ valid: true });
      }
    }
  }, [product, qty, price]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.customer_name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    if (!formData.customer_email.trim() || !/\S+@\S+\.\S+/.test(formData.customer_email)) {
      setError('Email inválido');
      return false;
    }
    if (!formData.customer_phone.trim()) {
      setError('Telefone é obrigatório');
      return false;
    }
    if (!formData.customer_document.trim() || formData.customer_document.replace(/\D/g, '').length < 11) {
      setError('CPF inválido');
      return false;
    }
    setError(null);
    return true;
  };

  const handlePixPayment = async () => {
    if (!validateForm()) return;
    
    // Validar produto antes de prosseguir
    if (productValidation && !productValidation.valid) {
      setError(productValidation.error || 'Produto inválido');
      return;
    }
    
    setIsProcessingPayment(true);
    setError(null);

    try {
      const pixResponse = await pixService.createPixCharge({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        customer_document: formData.customer_document,
        instagram_username: username,
        service_type: serviceLabel.toLowerCase().includes('seguidores') ? 'followers' : serviceLabel.toLowerCase().includes('visualizações') ? 'views' : 'likes',
        quantity: contracted,
        unit_price: totalAmount / contracted,
        total_amount: grandTotal,
      });

      if (pixResponse.success && pixResponse.data) {
        setPixModalData({
          qrCode: pixResponse.data.qr_code,
          qrCodeBase64: pixResponse.data.qr_code_base64,
          copyPasteCode: pixResponse.data.copy_paste_code,
          orderId: pixResponse.data.order_id,
          expirationAt: pixResponse.data.expiration_at,
        });
        setShowPixModal(true);
      } else {
        setError(pixResponse.error || 'Erro ao criar cobrança PIX');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentConfirmed = () => {
    setShowPixModal(false);
    // Redirecionar para página de sucesso
    window.location.href = `/checkout/success?order_id=${pixModalData?.orderId}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-viral-700 mb-6">Turbine seu perfil do Instagram 🚀</h1>

      {loading && (
        <div className="bg-white shadow rounded p-6 text-center">Carregando perfil…</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 mb-6">{error}</div>
      )}

      {productLoading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center mb-4">
          Carregando informações do produto...
        </div>
      )}

      {productError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center mb-4">
          Erro ao carregar produto: {productError}
        </div>
      )}

      {productValidation && !productValidation.valid && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center mb-4">
          ⚠️ {productValidation.error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna esquerda */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Card Perfil */}
            <div className="bg-white shadow rounded p-6">
              <div className="flex items-center gap-4">
                <img
                  src={data.profile_pic_url ? `/api/instagram/profile_pic_proxy?url=${encodeURIComponent(data.profile_pic_url)}` : '/favicon.svg'}
                  alt="avatar"
                  className="h-16 w-16 rounded-full border"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/favicon.svg';
                  }}
                />
                <div>
                  <div className="font-semibold text-lg">{data.full_name || data.username}</div>
                  <div className="text-sm text-gray-600">@{data.username}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 text-center mt-6">
                <div>
                  <div className="text-sm text-gray-500">Seguidores atuais</div>
                  <div className="text-lg font-semibold">{currentFollowers !== null ? currentFollowers.toLocaleString('pt-BR') : '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Contratados</div>
                  <div className="text-lg font-semibold text-green-600">+{contracted.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Após compra</div>
                  <div className="text-lg font-semibold">{afterPurchase.toLocaleString('pt-BR')}</div>
                </div>
              </div>
            </div>

            {/* Card Detalhes do Serviço */}
            <div className="bg-white shadow rounded p-6">
              <h2 className="text-lg font-semibold mb-2">Detalhes do Serviço</h2>
              <div className="text-sm text-gray-700">Serviço: {serviceLabel}</div>
              <div className="text-sm text-gray-700">Quantidade: {contracted.toLocaleString('pt-BR')} seguidores</div>
              <ul className="mt-4 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Reposição grátis em até 30 dias</li>
                <li>Perfis reais e alta qualidade</li>
                <li>Entrega rápida e contínua</li>
              </ul>
            </div>

            {/* Card Importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-6">
              <h3 className="font-semibold mb-2">Importante</h3>
              <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
                <li>Mantenha o perfil público durante a entrega.</li>
                <li>Não altere @, nome ou URL até a conclusão.</li>
                <li>Entrega rápida; sistema permanece automático por 24h.</li>
                <li>Garantimos alta qualidade na execução.</li>
              </ul>
            </div>
          </div>

          {/* Coluna direita */}
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-lg font-semibold mb-4">Finalize seu pedido agora 🔥</h2>
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Nome completo" 
                className="border rounded px-3 py-2"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="border rounded px-3 py-2"
                value={formData.customer_email}
                onChange={(e) => handleInputChange('customer_email', e.target.value)}
              />
              <input 
                type="tel" 
                placeholder="Telefone/WhatsApp" 
                className="border rounded px-3 py-2"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="CPF (somente números)" 
                className="border rounded px-3 py-2"
                value={formData.customer_document}
                onChange={(e) => handleInputChange('customer_document', e.target.value.replace(/\D/g, ''))}
                maxLength={11}
              />
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
            <div className="mt-4 border-t pt-4 flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-600">Valor total</div>
                <div className="text-xl font-bold">{formatBRL(totalAmount)}</div>
              </div>
              <button 
                onClick={handlePixPayment}
                disabled={isProcessingPayment || (productValidation && !productValidation.valid)}
                className="bg-viral-500 hover:bg-viral-600 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded flex items-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </>
                ) : (productValidation && !productValidation.valid) ? 'Produto Inválido' : 'Pagar com PIX'}
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div className="border border-pink-300 rounded-2xl p-4 bg-white">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-white">
                    <UserPlus className="h-7 w-7" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-semibold">Adicionar {contracted.toLocaleString('pt-BR')} Seguidores Mundiais Instagram ao meu pedido</div>
                    <div className="text-teal-600 text-sm">Oferta Exclusiva!</div>
                    <div className="mt-1 text-sm">
                      <span className="line-through text-gray-400 mr-2">{formatBRL(totalAmount)}</span>
                      <span className="font-bold">{formatBRL(totalAmount * (1 - followersDiscountPct))}</span>
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
                    <div className="font-semibold">Adicionar {contracted.toLocaleString('pt-BR')} Curtidas Mundiais Instagram ao meu pedido</div>
                    <div className="text-teal-600 text-sm">Oferta Exclusiva!</div>
                    <div className="mt-1 text-sm">
                      <span className="font-bold">{formatBRL(likesPrice)}</span>
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
                    <div className="font-semibold">Adicionar {contracted.toLocaleString('pt-BR')} Visualizações Instagram ao meu pedido</div>
                    <div className="text-teal-600 text-sm">Oferta Exclusiva!</div>
                    <div className="mt-1 text-sm">
                      <span className="font-bold">{formatBRL(viewsPrice)}</span>
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
          </div>
        </div>
      )}

      {/* Modal de Pagamento PIX */}
      {showPixModal && pixModalData && (
        <PixPaymentModal
          isOpen={showPixModal}
          onClose={() => setShowPixModal(false)}
          pixData={pixModalData}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}
    </div>
  );
};

export default CheckoutInstagramProfile;
