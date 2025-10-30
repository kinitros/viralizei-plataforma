import React from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from '@/components/SocialIcons';

interface ServiceItem {
  title: string;
  badges: { label: string; variant?: 'default' | 'success' | 'warning' | 'info' }[];
  ctaLink?: string;
}

const badgeClass = (variant: 'default' | 'success' | 'warning' | 'info' = 'default') => {
  switch (variant) {
    case 'success':
      return 'bg-green-100 text-green-700';
    case 'warning':
      return 'bg-yellow-100 text-yellow-700';
    case 'info':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const services: ServiceItem[] = [
  {
    title: 'Inscritos',
    badges: [
      { label: 'Premium', variant: 'info' },
      { label: 'Entrega Rápida', variant: 'success' },
    ],
    ctaLink: '/youtube/inscritos',
  },
  {
    title: 'Curtidas',
    badges: [
      { label: 'Premium', variant: 'info' },
      { label: 'Entrega Rápida', variant: 'success' },
    ],
    ctaLink: '/youtube/curtidas',
  },
  {
    title: 'Visualizações',
    badges: [
      { label: 'Entrega Rápida', variant: 'success' },
      { label: 'Views', variant: 'default' },
    ],
    ctaLink: '/youtube/visualizacoes',
  },
];

const YouTubeServices: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <motion.div
        className="flex items-center space-x-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SocialIcon platform="youtube" size={32} className="text-red-600" />
        <h1 className="text-3xl md:text-4xl font-bold">Serviços YouTube</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="flex items-center space-x-3">
                <SocialIcon platform="youtube" size={24} className="text-red-600" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.badges.map((b, i) => (
                  <span key={i} className={`px-2 py-1 rounded-full text-xs ${badgeClass(b.variant)}`}>{b.label}</span>
                ))}
              </div>
            </div>
            <motion.a
              href={item.ctaLink || '#'}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold w-full md:w-auto mt-4 md:mt-0 text-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Comprar Agora
            </motion.a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeServices;