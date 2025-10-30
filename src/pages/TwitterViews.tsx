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

const packages: Package[] = [
  { qty: 500, priceBRL: 9.90, discountPct: 0.35 },
  { qty: 1000, priceBRL: 14.90, discountPct: 0.40 },
  { qty: 2000, priceBRL: 27.90, discountPct: 0.42 },
  { qty: 3000, priceBRL: 39.90, discountPct: 0.45 },
  { qty: 5000, priceBRL: 59.90, discountPct: 0.50 },
  { qty: 10000, priceBRL: 99.90, discountPct: 0.55 },
];

const TwitterViews: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        className="flex flex-col items-center justify-center space-y-2 mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SocialIcon platform="twitter" size={32} className="text-sky-600" />
        <h1 className="text-3xl md:text-4xl font-bold text-center">Visualizações no Twitter</h1>
      </motion.div>

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
              buttonText="Comprar Agora"
              onBuy={() => {
                import('@/lib/checkout').then(({ openCheckout }) => openCheckout('twitter.views', pkg.qty));
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TwitterViews;