import React from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from '@/components/SocialIcons';
import ServicePriceCard from '@/components/ServicePriceCard';

interface Package { qty: number; priceBRL: number; discountPct?: number; bestChoice?: boolean; }

const formatOriginalFromDiscount = (price: number, discountPct?: number) => {
  if (!discountPct) return undefined;
  const original = price / (1 - discountPct);
  return Math.round(original * 100) / 100;
};

// Preços conforme imagem enviada para Visualizações Kwai
const packages: Package[] = [
  { qty: 500, priceBRL: 14.90 },
  { qty: 1000, priceBRL: 29.90 },
  { qty: 2000, priceBRL: 59.90 },
  { qty: 3000, priceBRL: 89.90 },
  { qty: 5000, priceBRL: 149.90, bestChoice: true },
  { qty: 10000, priceBRL: 279.90 },
];

const KwaiViews: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        className="flex flex-col items-center justify-center space-y-2 mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SocialIcon platform="kwai" size={32} className="text-orange-500" />
        <h1 className="text-3xl md:text-4xl font-bold text-center">Visualizações Kwai</h1>
      </motion.div>

      {/* Aviso Importante */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Aviso Importante</h3>
        <p className="text-gray-700 mt-2">
          Após a finalização do pagamento você terá o acesso ao nosso whatsapp pra enviar o link da publicação ou publicações e receber nossas visualizações e suporte
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {packages.map((pkg, idx) => (
          <motion.div
            key={pkg.qty}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <ServicePriceCard
              qty={pkg.qty}
              unitLabel="VISUALIZAÇÕES"
              priceBRL={pkg.priceBRL}
              originalBRL={formatOriginalFromDiscount(pkg.priceBRL, pkg.discountPct)}
              discountLabel={pkg.discountPct ? `${Math.round(pkg.discountPct * 100)}% OFF` : undefined}
              headerBgClass="bg-orange-600"
              discountBadgeClass="bg-white text-red-600 border border-red-600"
              bestChoice={pkg.bestChoice}
              buttonText="Comprar Agora"
              onBuy={() => {
                import('@/lib/checkout').then(({ openCheckout }) => openCheckout('kwai.views', pkg.qty));
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KwaiViews;