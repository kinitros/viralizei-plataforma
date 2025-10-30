import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  TrendingUp, 
  Users, 
  Heart, 
  Eye, 
  MessageCircle, 
  Star,
  Shield,
  Zap,
  Target,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SocialIcon } from '../components/SocialIcons';
import FollowerGrowthAnimation from '../components/FollowerGrowthAnimation';

interface Service {
  platform: string;
  icon: string;
  color: string;
  services: string[];
  link: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const Home: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [stats, setStats] = useState({
    followers: 2847392,
    likes: 15847293,
    views: 98472847,
    clients: 234847
  });

  // Simular contadores dinâmicos
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        followers: prev.followers + Math.floor(Math.random() * 10) + 1,
        likes: prev.likes + Math.floor(Math.random() * 50) + 10,
        views: prev.views + Math.floor(Math.random() * 100) + 50,
        clients: prev.clients + Math.floor(Math.random() * 3) + 1
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const services: Service[] = [
    {
      platform: 'Instagram',
      icon: 'instagram',
      color: 'from-pink-500 to-purple-600',
      services: ['Seguidores', 'Likes', 'Views', 'Comentários'],
      link: '/instagram'
    },
    {
      platform: 'TikTok',
      icon: 'tiktok',
      color: 'from-black to-gray-800',
      services: ['Seguidores', 'Likes', 'Views', 'Shares'],
      link: '/tiktok'
    },
    {
      platform: 'YouTube',
      icon: 'youtube',
      color: 'from-red-500 to-red-700',
      services: ['Inscritos', 'Views', 'Likes', 'Comentários'],
      link: '/youtube'
    },
    {
      platform: 'Facebook',
      icon: 'facebook',
      color: 'from-blue-500 to-blue-700',
      services: ['Seguidores', 'Likes', 'Shares', 'Comentários'],
      link: '/facebook'
    },
    {
      platform: 'Twitter/X',
      icon: 'twitter',
      color: 'from-gray-700 to-black',
      services: ['Seguidores', 'Likes', 'Retweets', 'Views'],
      link: '/twitter'
    },
    {
      platform: 'Kwai',
      icon: 'kwai',
      color: 'from-orange-500 to-orange-700',
      services: ['Seguidores', 'Curtidas', 'Visualizações'],
      link: '/kwai'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Marina Silva',
      role: 'Influenciadora Digital',
      content: 'Incrível! Meu Instagram cresceu 300% em apenas 2 semanas. Seguidores reais e engajamento autêntico!',
      rating: 5,
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20brazilian%20woman%20influencer%20smiling%20headshot%20photo&image_size=square'
    },
    {
      name: 'Carlos Mendes',
      role: 'Empresário',
      content: 'Viralizei transformou meu negócio! Agora tenho milhares de clientes através das redes sociais.',
      rating: 5,
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20brazilian%20businessman%20smiling%20headshot%20photo&image_size=square'
    },
    {
      name: 'Ana Costa',
      role: 'Artista',
      content: 'Minha música viralizou no TikTok graças ao Viralizei. Crescimento orgânico e real!',
      rating: 5,
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20brazilian%20female%20artist%20smiling%20headshot%20photo&image_size=square'
    }
  ];

  const faqs: FAQ[] = [
    {
      question: 'Como funciona o crescimento viral orgânico?',
      answer: 'Conectamos seu conteúdo com nossa rede de influenciadores reais que promovem organicamente suas publicações, gerando engajamento autêntico e crescimento sustentável.'
    },
    {
      question: 'Os seguidores e likes são reais?',
      answer: 'Sim! Trabalhamos apenas com perfis reais e ativos. Nossa rede é composta por influenciadores verificados que geram engajamento genuíno.'
    },
    {
      question: 'Quanto tempo leva para ver resultados?',
      answer: 'Os primeiros resultados aparecem em 24-48 horas. O crescimento completo acontece gradualmente ao longo de 7-14 dias para parecer natural.'
    },
    {
      question: 'É seguro para minha conta?',
      answer: 'Totalmente seguro! Nossos métodos são 100% orgânicos e seguem todas as diretrizes das plataformas. Nunca pedimos sua senha.'
    },
    {
      question: 'Posso escolher o público-alvo?',
      answer: 'Sim! Você pode segmentar por localização, idade, interesses e outros critérios para atingir exatamente seu público ideal.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Partículas Douradas Sutis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20 + Math.random() * 40],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo Principal */}
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-center sm:text-left text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  Viralize seu
                  <span className="block bg-gradient-to-r from-viral to-yellow-400 bg-clip-text text-transparent">
                    Perfil Agora!
                  </span>
                </h1>
                <p className="text-center sm:text-left text-lg md:text-xl mb-8 text-blue-100 max-w-2xl">
                  Impulsione suas redes sociais rapidamente com nossa plataforma de serviços.
                </p>
              </motion.div>

              {/* Features List */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto text-center sm:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-blue-100 font-medium">Não precisa seguir</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-blue-100 font-medium">100% seguro e sigiloso</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-blue-100 font-medium">Não precisa de senha</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-blue-100 font-medium">Suporte 24 horas</span>
                </div>
              </motion.div>

              {/* Call to Action Text with Arrow */}
              <motion.div
                className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <p className="text-blue-100 text-sm md:text-base font-medium text-center sm:text-left">
                  Clique no botão abaixo para testar
                </p>
                <motion.div
                  className="flex justify-center"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg 
                    className="w-6 h-6 text-viral" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 16l-6-6h12l-6 6z"/>
                  </svg>
                </motion.div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <a href="https://wa.me/31983584949?text=50%20Seguidores%20no%20Instagram%20por%20apenas%20R$5,90" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    className="bg-viral hover:bg-viral-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-viral/50 transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    50 Seguidores no Instagram por apenas R$5,90
                  </motion.button>
                </a>
              </motion.div>

              {/* Trust Section */}
              <motion.div
                className="flex items-center justify-center sm:justify-start gap-4 text-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {/* Profile Icons */}
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                    +
                  </div>
                </div>
                <div className="text-sm font-medium">
                  <span className="text-viral font-bold">+25k</span> de clientes confiam em nós
                </div>
              </motion.div>
            </div>

            {/* Animação de Crescimento */}
            <div className="flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <FollowerGrowthAnimation />
              </motion.div>
            </div>
          </div>

          {/* Texto explicativo da animação */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <p className="text-blue-100 text-sm md:text-base">
              ✨ Veja seu perfil crescendo em tempo real com nossos influenciadores
            </p>
          </motion.div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Serviços Mais Populares
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha sua plataforma e comece a viralizar hoje mesmo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={`h-32 bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                  <SocialIcon platform={service.icon} size={64} className={service.icon === 'kwai' ? 'text-orange-500' : 'text-white'} />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.platform}</h3>
                  <ul className="space-y-2 mb-6">
                    {service.services.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to={service.link}>
                    <motion.button
                      className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Viralizar {service.platform}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por Que Escolher o Viralizei?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A diferença está nos detalhes e na qualidade
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: '100% Seguro',
                description: 'Métodos orgânicos que protegem sua conta'
              },
              {
                icon: Zap,
                title: 'Resultados Rápidos',
                description: 'Primeiros resultados em 24-48 horas'
              },
              {
                icon: Target,
                title: 'Público-Alvo',
                description: 'Segmentação precisa para seu nicho'
              },
              {
                icon: Award,
                title: 'Qualidade Premium',
                description: 'Apenas influenciadores verificados'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mais de 200.000 clientes satisfeitos em todo o Brasil
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tire suas dúvidas sobre nossos serviços
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 bg-white border-l-4 border-primary"
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-viral">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto Para Viralizar?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de criadores que já transformaram suas redes sociais
            </p>
            <Link to="/todos-os-servicos">
              <motion.button
                className="bg-viral hover:bg-viral-600 text-white px-12 py-4 rounded-lg font-bold text-xl shadow-2xl hover:shadow-viral/50 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Começar Agora - É Grátis!
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;