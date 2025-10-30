import React from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from '@/components/SocialIcons';
import ServicePriceCard from '@/components/ServicePriceCard';
import { redirectToService } from '@/lib/serviceRedirect';
import { getHeaderBgClass } from '@/lib/utils';

interface Package { qty: number; priceBRL: number; discountPct?: number; bestChoice?: boolean; }

const formatOriginalFromDiscount = (price: number, discountPct?: number) => {
  if (!discountPct) return undefined;
  const original = price / (1 - discountPct);
  return Math.round(original * 100) / 100;
};

const packages: Package[] = [
  { qty: 500, priceBRL: 19.90, discountPct: 0.40 },
  { qty: 1000, priceBRL: 39.90, discountPct: 0.45 },
  { qty: 2000, priceBRL: 79.90, discountPct: 0.48, bestChoice: true },
  { qty: 3000, priceBRL: 119.90, discountPct: 0.50 },
  { qty: 5000, priceBRL: 199.90, discountPct: 0.55 },
  { qty: 10000, priceBRL: 399.90, discountPct: 0.60 },
];

const FacebookFollowersWorldwide: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        className="flex flex-col items-center justify-center space-y-2 mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SocialIcon platform="facebook" size={32} className="text-blue-600" />
        <h1 className="text-3xl md:text-4xl font-bold text-center">Seguidores Mundiais no Facebook</h1>
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
              unitLabel="SEGUIDORES MUNDIAIS"
              priceBRL={pkg.priceBRL}
              originalBRL={formatOriginalFromDiscount(pkg.priceBRL, pkg.discountPct)}
              discountLabel={pkg.discountPct ? `${Math.round(pkg.discountPct * 100)}% OFF` : undefined}
              headerBgClass={getHeaderBgClass('facebook', false)}
              bestChoice={pkg.bestChoice}
              buttonText="Comprar Agora"
              onBuy={() => {
                redirectToService({ platform: 'facebook', type: 'followers', region: 'world' }, pkg.qty);
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FacebookFollowersWorldwide;