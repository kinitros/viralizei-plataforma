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
    title: 'Seguidores Brasileiros',
    badges: [
      { label: 'Premium', variant: 'info' },
      { label: 'Entrega Rápida', variant: 'success' },
      { label: 'BR', variant: 'warning' },
    ],
    ctaLink: '/kwai/seguidores-brasileiros',
  },
  {
    title: 'Curtidas Brasileiras',
    badges: [
      { label: 'Premium', variant: 'info' },
      { label: 'Entrega Rápida', variant: 'success' },
      { label: 'BR', variant: 'warning' },
    ],
    ctaLink: '/kwai/curtidas-brasileiras',
  },
  {
    title: 'Visualizações',
    badges: [
      { label: 'Entrega Rápida', variant: 'success' },
      { label: 'Viral', variant: 'default' },
    ],
    ctaLink: '/kwai/visualizacoes',
  },
];

const KwaiServices: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Serviços para Kwai</h1>
          <p className="text-gray-600 mt-2">Selecione o serviço ideal para crescer com segurança e rapidez</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <SocialIcon platform="kwai" size={24} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{service.title}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {service.badges.map((b) => (
                      <span
                        key={b.label}
                        className={`text-xs px-2 py-1 rounded-full ${badgeClass(b.variant ?? 'default')}`}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <motion.a
                href={service.ctaLink ?? '#'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Comprar Agora
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KwaiServices;