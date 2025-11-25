import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PixPaymentModal } from '../components/PixPaymentModal';
import { pixService } from '../services/pix';
import { useProductByServiceKey } from '../hooks/useProducts';
import { Product } from '../types/product';
import { SocialIcon } from '../components/SocialIcons';
import { unpackCheckoutData } from '../lib/encryption';
import { resolveProductPrice } from '../lib/priceResolver';

interface ProfileData {
  username?: string;
  full_name?: string;
  profile_pic_url?: string;
  followers_count?: number;
  is_verified?: boolean;
}

const GenericCheckout: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const [searchParams] = useSearchParams();

  const [resolvedKey, setResolvedKey] = useState<string>('');
  const [resolvedQty, setResolvedQty] = useState<number>(0);
  const [resolvedPrice, setResolvedPrice] = useState<string | null>(null);
  const [invalidPacked, setInvalidPacked] = useState<boolean>(false);

  useEffect(() => {
    const packed = searchParams.get('data');
    if (packed) {
      const decoded = unpackCheckoutData(packed);
      if (!decoded) {
        setInvalidPacked(true);
        return;
      }
      setResolvedKey(decoded.key || '');
      setResolvedQty(Number(decoded.qty || '0'));
      setResolvedPrice(decoded.price !== null ? String(decoded.price) : null);
    } else {
      const qty = Number(searchParams.get('qty') || '0');
      const key = searchParams.get('key') || '';
      const price = searchParams.get('price');
      setResolvedKey(key);
      setResolvedQty(qty);
      setResolvedPrice(price);
    }
  }, [searchParams]);

  useEffect(() => {
    if (invalidPacked) {
      window.location.href = '/';
    }
  }, [invalidPacked]);

  const { product, loading: productLoading, error: productError } = useProductByServiceKey(resolvedKey);

  const [step, setStep] = useState<'profile' | 'checkout'>('profile');
  const [profileUrl, setProfileUrl] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<ProfileData | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<any>(null);

  const [productValidation, setProductValidation] = useState<{ valid: boolean; error?: string; } | null>(null);

  useEffect(() => {
    if (product && resolvedQty > 0) {
      if (product.quantity !== resolvedQty) {
        setProductValidation({ valid: false, error: `Quantidade inválida. Produto disponível: ${product.quantity}` });
      } else if (!product.is_active) {
        setProductValidation({ valid: false, error: 'Produto indisponível no momento' });
      } else {
        setProductValidation({ valid: true });
      }
    }
  }, [product, resolvedQty, resolvedPrice]);

  const platformConfig = useMemo(() => {
    const labelFor = (p?: Product) => {
      if (!p) return 'Detalhes do Serviço';
      const base = p.service_type === 'followers' ? 'Seguidores' : p.service_type === 'likes' ? 'Curtidas' : p.service_type === 'views' ? 'Visualizações' : p.service_type === 'subscribers' ? 'Inscritos' : 'Serviço';
      const region = p.region === 'brazil' ? 'BR' : p.region === 'worldwide' ? 'Mundiais' : '';
      return `${base} ${region}`.trim();
    };

    const configs = {
      instagram: { name: 'Instagram', icon: 'instagram' as const, color: 'instagram', profilePlaceholder: 'https://instagram.com/seu_usuario', serviceLabel: labelFor(product) },
      tiktok: { name: 'TikTok', icon: 'tiktok' as const, color: 'tiktok', profilePlaceholder: 'https://tiktok.com/@seu_usuario', serviceLabel: labelFor(product) },
      kwai: { name: 'Kwai', icon: 'kwai' as const, color: 'kwai', profilePlaceholder: 'https://kwai.com/@seu_usuario', serviceLabel: labelFor(product) },
      youtube: { name: 'YouTube', icon: 'youtube' as const, color: 'youtube', profilePlaceholder: 'https://youtube.com/@seu_canal', serviceLabel: labelFor(product) },
      facebook: { name: 'Facebook', icon: 'facebook' as const, color: 'facebook', profilePlaceholder: 'https://facebook.com/seu_perfil', serviceLabel: labelFor(product) },
      twitter: { name: 'Twitter/X', icon: 'twitter' as const, color: 'twitter', profilePlaceholder: 'https://twitter.com/seu_usuario', serviceLabel: labelFor(product) }
    };
    return configs[platform as keyof typeof configs] || configs.instagram;
  }, [platform, product]);

  const [effectivePrice, setEffectivePrice] = useState<number>(0);
  useEffect(() => {
    const run = async () => {
      const fallback = product ? product.price : (resolvedPrice ? Number(resolvedPrice) : 0);
      if (!resolvedKey || !resolvedQty) {
        setEffectivePrice(fallback);
        return;
      }
      const resolved = await resolveProductPrice(resolvedKey, resolvedQty, fallback);
      setEffectivePrice(resolved);
    };
    run();
  }, [resolvedKey, resolvedQty, product, resolvedPrice]);

  const totalAmount = effectivePrice;
  const contracted = resolvedQty || 0;

  const extractUsername = (url: string) => {
    const patterns = {
      instagram: /(?:instagram\.com\/)([^\/\?\s]+)/,
      tiktok: /(?:tiktok\.com\/[\@]?)([^\/\?\s]+)/,
      kwai: /(?:kwai\.com\/[\@]?)([^\/\?\s]+)/,
      youtube: /(?:youtube\.com\/[\@]?)([^\/\?\s]+)/,
      facebook: /(?:facebook\.com\/)([^\/\?\s]+)/,
      twitter: /(?:twitter\.com\/)([^\/\?\s]+)/
    };
    const pattern = patterns[platform as keyof typeof patterns] || patterns.instagram;
    const match = url.match(pattern);
    return match ? match[1].replace('@', '') : null;
  };

  const onlyDigits = (v: string) => v.replace(/\D/g, '');

  const formatCPF = (v: string) => {
    const digits = onlyDigits(v).slice(0, 11);
    const parts = [] as string[];
    if (digits.length > 0) parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push(digits.slice(3, 6));
    if (digits.length > 6) parts.push(digits.slice(6, 9));
    const rest = digits.slice(9, 11);
    const base = parts.join('.');
    return rest ? `${base}-${rest}` : base;
  };

  const isValidCPF = (cpfStr: string) => {
    const d = onlyDigits(cpfStr);
    if (d.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(d)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(d.charAt(i)) * (10 - i);
    let mod = sum % 11;
    let check1 = mod < 2 ? 0 : 11 - mod;
    if (check1 !== parseInt(d.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(d.charAt(i)) * (11 - i);
    mod = sum % 11;
    const check2 = mod < 2 ? 0 : 11 - mod;
    return check2 === parseInt(d.charAt(10));
  };

  const formatPhone = (v: string) => {
    const d = onlyDigits(v).slice(0, 11);
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const validateProfileStep = () => {
    if (!profileUrl.trim()) {
      setError('Por favor, insira o link do perfil');
      return false;
    }
    return true;
  };

  const validateCheckoutStep = () => {
    if (!fullName.trim()) { setError('Por favor, insira seu nome completo'); return false; }
    if (!email.trim()) { setError('Por favor, insira seu e-mail'); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('Por favor, insira um e-mail válido'); return false; }
    const phoneDigits = onlyDigits(phone);
    if (phoneDigits.length < 10 || phoneDigits.length > 11) { setError('Por favor, insira um telefone válido'); return false; }
    if (!isValidCPF(cpf)) { setError('Por favor, insira um CPF válido'); return false; }
    if (productValidation && !productValidation.valid) { setError(productValidation.error || 'Produto inválido'); return false; }
    return true;
  };

  const handleProfileSubmit = async () => {
    if (!validateProfileStep()) return;

    const extractedUsername = extractUsername(profileUrl);
    if (!extractedUsername) { setError('Por favor, insira um link válido'); return; }

    setLoading(true);
    setError('');

    try {
      const mockData: ProfileData = {
        username: extractedUsername,
        full_name: extractedUsername,
        profile_pic_url: `https://via.placeholder.com/150x150.png?text=${extractedUsername.charAt(0).toUpperCase()}`,
        followers_count: Math.floor(Math.random() * 10000) + 100,
        is_verified: Math.random() > 0.8
      };
      setData(mockData);
      setUsername(extractedUsername);
      setStep('checkout');
    } catch (err) {
      setError('Erro ao buscar perfil. Verifique o link e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePixPayment = async () => {
    if (!validateCheckoutStep()) return;

    setIsProcessingPayment(true);
    setError('');

    try {
      const pixResponse = await pixService.createPixCharge({
        customer_name: fullName.trim() || (username || email.split('@')[0]).trim(),
        customer_email: email.trim(),
        instagram_username: username.trim(),
        service_type: product ? product.service_type : 'followers',
        quantity: contracted,
        unit_price: contracted > 0 ? totalAmount / contracted : totalAmount,
        total_amount: totalAmount,
      });

      if (pixResponse.success && pixResponse.data) {
        setPixData({
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar pagamento PIX');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentConfirmed = () => {
    setShowPixModal(false);
    const orderId = pixData?.orderId;
    if (orderId) {
      window.location.href = `/checkout/success?order_id=${orderId}`;
    }
  };

  const currentFollowers = data?.followers_count ?? null;
  const afterPurchase = currentFollowers !== null ? currentFollowers + contracted : contracted;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <SocialIcon platform={platformConfig.icon} size={48} className={`text-${platformConfig.color}-500`} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {step === 'profile' ? `Como turbinar seu ${platformConfig.name}` : `Turbine seu perfil do ${platformConfig.name}`}
          </h1>
          <p className="text-gray-600">{platformConfig.serviceLabel}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center mb-4">
            {error}
          </div>
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
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-center mb-4">
            ⚠️ {productValidation.error}
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm">Verificar Perfil</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm">Escolher Conteúdo</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm">Finalizar Compra</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Verificar Perfil do {platformConfig.name}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Perfil do {platformConfig.name}</label>
                  <input
                    type="url"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder={platformConfig.profilePlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Digite o @usuario (ex: @seuusuario) ou a URL completa do perfil</p>
                </div>
                <button
                  onClick={handleProfileSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Verificando...' : 'Verificar Perfil'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{platformConfig.serviceLabel}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Quantidade</div>
                    <div className="text-xl font-bold">{contracted.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Preço</div>
                    <div className="text-xl font-bold text-green-600">R$ {totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Detalhes do Serviço</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Perfis de Alta qualidade</li>
                  <li>Velocidade média e entrega progressiva</li>
                  <li>Início em até 2 horas</li>
                  <li>Proteção contra perda de seguidores</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 'checkout' && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img src={data.profile_pic_url} alt={data.full_name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h3 className="text-lg font-semibold">@{data.username}</h3>
                    <p className="text-gray-600">{data.full_name}</p>
                    {data.is_verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Verificado</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{data.followers_count?.toLocaleString() || '0'}</div>
                    <div className="text-sm text-gray-600">Seguidores atuais</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{afterPurchase.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Depois da compra</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Benefícios do Serviço</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Perfis de Alta Qualidade</li>
                  <li>Velocidade: até 600 por dia</li>
                  <li>Proteção contra perda de seguidores</li>
                  <li>Início em 2–6 horas</li>
                  <li>Reposição grátis por 30 dias</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Informações Importantes</h4>
                <ul className="space-y-1 text-sm">
                  <li><span className="font-semibold">Atenção:</span> Não altere o nome de usuário durante o processo.</li>
                  <li><span className="font-semibold">Prazo:</span> A entrega é gradual conforme o pacote contratado.</li>
                  <li><span className="font-semibold">Qualidade:</span> Entrega com perfil real e alta qualidade.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Finalize seu pedido agora</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone/WhatsApp</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                    <input type="text" value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="000.000.000-00" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Resumo do pedido</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Quantidade:</span><span className="font-medium">{contracted.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Serviço:</span><span className="font-medium">{platformConfig.serviceLabel}</span></div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total:</span><span className="text-green-600">R$ {totalAmount.toFixed(2)}</span></div>
                </div>
                <button
                  onClick={handlePixPayment}
                  disabled={isProcessingPayment || (productValidation && !productValidation.valid)}
                  className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isProcessingPayment ? 'Processando...' : `Finalizar Pedido - R$ ${totalAmount.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {showPixModal && pixData && (
          <PixPaymentModal
            isOpen={showPixModal}
            onClose={() => setShowPixModal(false)}
            pixData={pixData}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}
      </div>
    </div>
  );
};

export default GenericCheckout;
