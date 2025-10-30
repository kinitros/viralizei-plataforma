import React from 'react';
import { motion } from 'framer-motion';

interface ServicePriceCardProps {
  qty: number;
  unitLabel?: string; // default: Instagram Followers
  priceBRL: number;
  originalBRL?: number;
  discountLabel?: string; // e.g. "55% OFF"
  bestChoice?: boolean;
  onBuy?: () => void;
  buttonText?: string;
  headerBgClass?: string; // permite configurar a cor do header (ex.: bg-green-600)
  discountBadgeClass?: string; // permite configurar o estilo do box de desconto
}

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CheckIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4 text-green-600 mr-2' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.704 5.296a1 1 0 00-1.408-1.408L8 11.184 4.704 7.888a1 1 0 10-1.408 1.408l4 4a1 1 0 001.408 0l8-8z" clipRule="evenodd" />
  </svg>
);

const ServicePriceCard: React.FC<ServicePriceCardProps> = ({
  qty,
  unitLabel = 'Instagram Followers',
  priceBRL,
  originalBRL,
  discountLabel,
  bestChoice,
  onBuy,
  buttonText = 'Buy Now',
  headerBgClass = 'bg-pink-600',
  discountBadgeClass,
}) => {return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Header (Desktop) */}
      <div className="relative hidden md:block">
        <div className={`h-24 ${headerBgClass} text-white flex items-center justify-between px-6`}>
          <div className="flex items-center space-x-2">
            {bestChoice && (
              <span className="text-xs bg-white text-gray-900 font-semibold px-2 py-1 rounded-full">Melhor Escolha</span>
            )}
            {discountLabel && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${discountBadgeClass ?? 'bg-red-500 text-white'}`}>
                {discountLabel}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{qty}</div>
            <div className="text-sm md:text-base opacity-90 font-semibold">{unitLabel}</div>
          </div>
        </div>
      </div>

      {/* Header (Mobile) */}
      <div className="md:hidden">
        <div className={`h-24 ${headerBgClass} text-white flex flex-col items-center justify-center px-6`}>
          <div className="text-5xl font-bold tracking-tight">{qty.toLocaleString('pt-BR')}</div>
          <div className="text-base font-semibold uppercase tracking-wide">{unitLabel}</div>
        </div>
      </div>

      {/* Pricing area - Mobile: stacked, original abaixo em vermelho; Desktop com botão à direita */}
      <div className="px-6 py-5 flex flex-col md:flex-row items-center md:items-baseline md:justify-between">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0 text-center md:text-left">
          <div className="text-4xl md:text-2xl font-bold text-gray-900">{formatBRL(priceBRL)}</div>
          {originalBRL && (
            <div className="mt-1 text-red-600 line-through text-base md:text-sm">{formatBRL(originalBRL)}</div>
          )}
        </div>
        <motion.button
          onClick={onBuy}
          className="hidden md:inline-flex bg-primary text-white px-4 py-2 rounded-lg font-semibold"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {buttonText}
        </motion.button>
      </div>

      {/* Features inside card - Mobile: centered */}
      <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start"><CheckIcon />Não precisa de senha</div>
        <div className="flex items-center justify-center md:justify-start"><CheckIcon />30 Dias de reposição</div>
        <div className="flex items-center justify-center md:justify-start"><CheckIcon />Entrega rápida</div>
      </div>
      
      {/* Button at the bottom for mobile */}
      <div className="px-6 pb-6 mt-auto">
        <motion.button
          onClick={onBuy}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold w-full md:hidden"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ServicePriceCard;