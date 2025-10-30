import React from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from '@/components/SocialIcons';
import ServicePriceCard from '@/components/ServicePriceCard';

interface Package { qty: number; priceBRL: number; discountPct?: number }

const computeOriginalFromDiscount = (current: number, discountPct: number) => {
  return current / (1 - discountPct / 100)
}

const packagesViews: Package[] = [
  { qty: 500, priceBRL: 10.90, discountPct: 45 },
  { qty: 1000, priceBRL: 19.90, discountPct: 45 },
  { qty: 2000, priceBRL: 34.90, discountPct: 50 },
  { qty: 3000, priceBRL: 49.90, discountPct: 50 },
  { qty: 5000, priceBRL: 74.90, discountPct: 55 },
  { qty: 10000, priceBRL: 139.90, discountPct: 60 },
];

const TiktokViews: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center justify-center space-y-2 md:flex-col md:justify-center md:space-y-2 mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SocialIcon platform="tiktok" size={36} className="text-black" />
        <h1 className="text-3xl md:text-4xl font-bold text-center">Visualizações Tiktok</h1>
        <p className="text-gray-700 text-center">(Views)</p>
      </motion.div>

      {/* Grid de preços */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {packagesViews.map((pkg, idx) => (
          <motion.div
            key={pkg.qty}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <ServicePriceCard
              qty={pkg.qty}
              unitLabel="Visualizações"
              priceBRL={pkg.priceBRL}
              originalBRL={pkg.discountPct ? computeOriginalFromDiscount(pkg.priceBRL, pkg.discountPct) : undefined}
              discountLabel={pkg.discountPct ? `${pkg.discountPct}% OFF` : undefined}
              buttonText="Comprar Agora"
              onBuy={() => {
                import('@/lib/serviceRedirect').then(({ redirectToTikTok }) => redirectToTikTok.views(pkg.qty));
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TiktokViews;