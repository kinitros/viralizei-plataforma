import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from '@/components/SocialIcons';
import ServicePriceCard from '@/components/ServicePriceCard';
import FollowersSwitch from '@/components/FollowersSwitch';
import { redirectToInstagram } from '@/lib/serviceRedirect';

interface Package {
  qty: number;
  priceBRL: number; // preço atual
  discountPct?: number; // para preço original
  bestChoice?: boolean;
}

const formatOriginalFromDiscount = (price: number, discountPct?: number) => {
  if (!discountPct) return undefined;
  const original = price / (1 - discountPct);
  return Math.round(original * 100) / 100; // arredondar
};

const packages: Package[] = [
  { qty: 500, priceBRL: 34.90, discountPct: 0.44 },
  { qty: 1000, priceBRL: 64.90, discountPct: 0.40 },
  { qty: 2000, priceBRL: 119.90, discountPct: 0.45, bestChoice: true },
  { qty: 3000, priceBRL: 164.90, discountPct: 0.58 },
  { qty: 5000, priceBRL: 249.90, discountPct: 0.60 },
  { qty: 10000, priceBRL: 449.90, discountPct: 0.62 },
];

const Toggle: React.FC<{ options: string[]; value: string; onChange: (v: string) => void; }>
= ({ options, value, onChange }) => (
  <div className="inline-flex bg-gray-200 rounded-full p-1">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          value === opt ? 'bg-white shadow text-gray-900' : 'text-gray-700'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const InstagramFollowersWorldwide: React.FC = () => {
  const [quality, setQuality] = useState<'Alta Qualidade' | 'Premium'>('Alta Qualidade');
  const [target, setTarget] = useState<'Mundial' | 'País'>('Mundial');
  const [benefit, setBenefit] = useState<'Entrega Rápida' | 'Alta Qualidade' | 'Satisfação Garantida' | 'Suporte 24/7'>('Entrega Rápida');

  const benefitContent: Record<string, { title: string; description: string; imageUrl: string; icon: 'lightning'|'star'|'shield'|'support' }>= {
    'Entrega Rápida': {
      title: 'Garantia de Entrega Rápida',
      description: 'Os seguidores costumam começar a aparecer em até 1 minuto após a compra, graças ao nosso sistema automático de pedidos.',
      imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbe8?q=80&w=1200&auto=format&fit=crop',
      icon: 'lightning'
    },
    'Alta Qualidade': {
      title: 'Seguidores de Alta Qualidade',
      description: 'Priorizamos perfis estáveis, com melhor retenção e menor queda, preservando a reputação do seu perfil.',
      imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750d3fd3fa3?q=80&w=1200&auto=format&fit=crop',
      icon: 'star'
    },
    'Satisfação Garantida': {
      title: 'Satisfação Garantida',
      description: 'Garantimos reposição e suporte caso ocorra qualquer problema no pedido, com SLA definido.',
      imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop',
      icon: 'shield'
    },
    'Suporte 24/7': {
      title: 'Suporte 24/7',
      description: 'Nossa equipe está disponível 24 horas por dia para ajudar com dúvidas e acompanhar seus pedidos.',
      imageUrl: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1200&auto=format&fit=crop',
      icon: 'support'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center justify-center space-y-2 md:flex-col md:justify-center md:space-y-2 mb-16"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SocialIcon platform="instagram" size={32} className="text-pink-500" />
        <h1 className="text-3xl md:text-4xl font-bold text-center">Seguidores Mundiais no Instagram</h1>
        <p className="text-gray-700 text-center">(Seguidores do mundo inteiro)</p>
      </motion.div>

      <div className="flex justify-center mb-8">
        <FollowersSwitch current="world" />
      </div>

      {/* descrição removida conforme solicitação */}

        {/* Toggle de qualidade removido conforme solicitação */}

      {/* Grid de preços no estilo da imagem 1 */}
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
            key={pkg.qty}
            qty={pkg.qty}
            unitLabel="Seguidores"
            priceBRL={pkg.priceBRL}
            originalBRL={formatOriginalFromDiscount(pkg.priceBRL, pkg.discountPct)}
            discountLabel={pkg.discountPct ? `${Math.round(pkg.discountPct * 100)}% OFF` : undefined}
            bestChoice={pkg.bestChoice}
            buttonText="Comprar Agora"
            onBuy={async () => await redirectToInstagram.followersWorld(pkg.qty)}
          />
          </motion.div>
        ))}
      </div>

      {/* Seção de benefícios com abas (similar à imagem) */}
      <motion.div
        className="mt-24 bg-pink-50 rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">Por que escolher nosso serviço de crescimento de seguidores no Instagram?</h2>

        {/* Abas */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-200 rounded-full p-1">
            {['Entrega Rápida','Alta Qualidade','Satisfação Garantida','Suporte 24/7'].map((label) => (
              <button
                key={label}
                onClick={() => setBenefit(label as any)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${benefit===label ? 'bg-white shadow text-gray-900' : 'text-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo da aba ativa */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              {benefitContent[benefit].icon === 'lightning' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" /></svg>
              )}
              {benefitContent[benefit].icon === 'star' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              )}
              {benefitContent[benefit].icon === 'shield' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2l8 4v6c0 5-3.4 9.3-8 10-4.6-.7-8-5-8-10V6l8-4z"/></svg>
              )}
              {benefitContent[benefit].icon === 'support' && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2a9 9 0 00-9 9v3a3 3 0 003 3h2v-6H6v-3a6 6 0 1112 0v3h-2v6h2a3 3 0 003-3v-3a9 9 0 00-9-9z"/></svg>
              )}
            </div>
            <h3 className="text-xl font-semibold">{benefitContent[benefit].title}</h3>
            <p className="text-gray-600">{benefitContent[benefit].description}</p>
          </div>
          <img src={benefitContent[benefit].imageUrl} alt={benefitContent[benefit].title} className="rounded-xl overflow-hidden shadow object-cover w-full h-48 md:h-56" />
        </div>
      </motion.div>

      {/* Seção de depoimentos de clientes */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Depoimentos de clientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Ana M.</span>
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 15l-5.878 3.09L5.4 12.18.8 8.41l6.49-.94L10 2l2.71 5.47 6.49.94-4.6 3.77 1.277 5.91z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm">Entrega muito rápida e suporte atencioso. Recomendo!</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Bruno S.</span>
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 15l-5.878 3.09L5.4 12.18.8 8.41l6.49-.94L10 2l2.71 5.47 6.49.94-4.6 3.77 1.277 5.91z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm">Ótimo custo-benefício. Meus posts ganharam alcance rapidamente.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Carla T.</span>
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 15l-5.878 3.09L5.4 12.18.8 8.41l6.49-.94L10 2l2.71 5.47 6.49.94-4.6 3.77 1.277 5.91z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm">Suporte excelente e entrega dentro do prazo. Muito satisfeito!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramFollowersWorldwide;