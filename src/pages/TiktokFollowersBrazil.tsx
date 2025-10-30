import React from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from '@/components/SocialIcons';
import ServicePriceCard from '@/components/ServicePriceCard';
import FollowersSwitch from '@/components/FollowersSwitch';

interface Package { qty: number; priceBRL: number; discountPct?: number; bestChoice?: boolean }

const formatOriginalFromDiscount = (price: number, discountPct?: number) => {
  if (!discountPct) return undefined;
  const original = price / (1 - discountPct);
  return Math.round(original * 100) / 100;
};

const packagesBR: Package[] = [
  { qty: 500, priceBRL: 34.90, discountPct: 0.35 },
  { qty: 1000, priceBRL: 69.90, discountPct: 0.44 },
  { qty: 2000, priceBRL: 139.90, discountPct: 0.45 },
  { qty: 3000, priceBRL: 199.90, discountPct: 0.50 },
  { qty: 5000, priceBRL: 319.90, discountPct: 0.58 },
  { qty: 10000, priceBRL: 599.90, discountPct: 0.60 },
];

const TiktokFollowersBrazil: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center justify-center space-y-2 md:flex-col md:justify-center mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SocialIcon platform="tiktok" size={36} className="text-black" />
        <h1 className="text-3xl md:text-4xl font-bold text-center">Seguidores Tiktok</h1>
        <p className="text-gray-700 text-center">Brasileiros (Seguidores apenas do Brasil)</p>
      </motion.div>

      {/* Switch */}
      <div className="flex justify-center mb-8">
        <FollowersSwitch
          current="br"
          worldPath="/tiktok/seguidores-mundiais"
          brPath="/tiktok/seguidores-brasileiros"
          worldLabel="Mundiais"
          brLabel="Brasileiros"
        />
      </div>

      {/* Grid de preços */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {packagesBR.map((pkg, idx) => (
          <motion.div
            key={pkg.qty}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <ServicePriceCard
              qty={pkg.qty}
              unitLabel="Seguidores Brasileiros"
              priceBRL={pkg.priceBRL}
              originalBRL={formatOriginalFromDiscount(pkg.priceBRL, pkg.discountPct)}
              discountLabel={pkg.discountPct ? `${Math.round(pkg.discountPct * 100)}% OFF` : undefined}
              buttonText="Comprar Agora"
              onBuy={() => {
                import('@/lib/serviceRedirect').then(({ redirectToTikTok }) => redirectToTikTok.followersBR(pkg.qty));
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TiktokFollowersBrazil;