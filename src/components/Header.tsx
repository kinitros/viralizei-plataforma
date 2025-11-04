import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Star, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { SocialIcon } from './SocialIcons';
import DropdownMenu from './DropdownMenu';
import MobileMenu from './MobileMenu';

interface AchievementBadge {
  id: string;
  text: string;
  timestamp: string;
  icon: string;
}

// Configurações dos menus dropdown
const socialMenus = {
  instagram: {
    title: 'Instagram',
    icon: 'instagram',
    items: [
      { label: 'Seguidores Mundiais', path: '/instagram/seguidores-mundiais', icon: 'users' },
      { label: 'Seguidores Brasileiros', path: '/instagram/seguidores-brasileiros', icon: 'users' },
      { label: 'Curtidas Mundiais', path: '/instagram/curtidas-mundiais', icon: 'heart' },
      { label: 'Curtidas Brasileiras', path: '/instagram/curtidas-brasileiras', icon: 'heart' },
      { label: 'Visualizações Reels', path: '/instagram/visualizacoes-reels', icon: 'eye' },
      { label: 'Visualizações Stories', path: '/instagram/visualizacoes-stories', icon: 'eye' },
    ]
  },
  tiktok: {
    title: 'TikTok',
    icon: 'tiktok',
    items: [
      { label: 'Seguidores Mundiais', path: '/tiktok/seguidores-mundiais', icon: 'users' },
      { label: 'Seguidores Brasileiros', path: '/tiktok/seguidores-brasileiros', icon: 'users' },
      { label: 'Curtidas Mundiais', path: '/tiktok/curtidas-mundiais', icon: 'heart' },
      { label: 'Curtidas Brasileiras', path: '/tiktok/curtidas-brasileiras', icon: 'heart' },
      { label: 'Visualizações', path: '/tiktok/visualizacoes', icon: 'eye' },
    ]
  },
  youtube: {
    title: 'YouTube',
    icon: 'youtube',
    items: [
      { label: 'Inscritos', path: '/youtube/inscritos', icon: 'users' },
      { label: 'Curtidas', path: '/youtube/curtidas', icon: 'heart' },
      { label: 'Visualizações', path: '/youtube/visualizacoes', icon: 'eye' },
    ]
  },
  outros: {
    title: 'Outros',
    icon: 'share',
    items: [
      { label: 'Facebook - Seguidores', path: '/facebook/seguidores-mundiais', icon: 'facebook' },
      { label: 'Facebook - Curtidas', path: '/facebook/curtidas', icon: 'facebook' },
      { label: 'Facebook - Visualizações', path: '/facebook/visualizacoes', icon: 'facebook' },
      { label: 'Twitter/X - Seguidores', path: '/twitter/seguidores', icon: 'twitter' },
      { label: 'Twitter/X - Curtidas', path: '/twitter/curtidas', icon: 'twitter' },
      { label: 'Twitter/X - Visualizações', path: '/twitter/visualizacoes', icon: 'twitter' },
      { label: 'Kwai - Seguidores', path: '/kwai/seguidores-brasileiros', icon: 'kwai' },
      { label: 'Kwai - Curtidas', path: '/kwai/curtidas-brasileiras', icon: 'kwai' },
      { label: 'Kwai - Visualizações', path: '/kwai/visualizacoes', icon: 'kwai' },
    ]
  }
};

const Header: React.FC = () => {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [achievements, setAchievements] = useState<AchievementBadge[]>([]);
  const [logoStep, setLogoStep] = useState(0);
  const logoCandidates = ['/brand/gramprovider.png', '/gramprovider-logo.png'];

  const achievementTemplates = [
    { text: 'Instagram - Seguidores recentes', icon: 'users' },
    { text: 'Instagram - Curtidas entregues', icon: 'heart' },
    { text: 'Instagram - Visualizações entregues', icon: 'eye' },
    { text: 'TikTok - Seguidores recentes', icon: 'users' },
    { text: 'TikTok - Curtidas entregues', icon: 'heart' },
    { text: 'TikTok - Visualizações entregues', icon: 'eye' },
    { text: 'YouTube - Curtidas entregues', icon: 'heart' },
    { text: 'YouTube - Visualizações entregues', icon: 'eye' },
    { text: 'Facebook - Seguidores recentes', icon: 'users' },
    { text: 'Facebook - Curtidas entregues', icon: 'heart' },
    { text: 'Facebook - Visualizações entregues', icon: 'eye' },
    { text: 'Twitter/X - Seguidores recentes', icon: 'users' },
    { text: 'Twitter/X - Curtidas entregues', icon: 'heart' },
    { text: 'Twitter/X - Visualizações entregues', icon: 'eye' },
    { text: 'Kwai - Seguidores recentes', icon: 'users' },
    { text: 'Kwai - Curtidas entregues', icon: 'heart' },
    { text: 'Kwai - Visualizações entregues', icon: 'eye' },
  ];

  const generateRandomAchievement = (): AchievementBadge => {
    const template = achievementTemplates[Math.floor(Math.random() * achievementTemplates.length)];
    const minutesAgo = Math.floor(Math.random() * 60) + 1;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      text: template.text,
      timestamp: `Verificado há ${minutesAgo} min`,
      icon: template.icon,
    };
  };

  useEffect(() => {
    // Gerar badges iniciais
    const initialAchievements = Array.from({ length: 6 }, () => generateRandomAchievement());
    setAchievements(initialAchievements);

    // Atualizar badges a cada 10 segundos
    const interval = setInterval(() => {
      setAchievements(prev => {
        const newAchievements = [...prev];
        const randomIndex = Math.floor(Math.random() * newAchievements.length);
        newAchievements[randomIndex] = generateRandomAchievement();
        return newAchievements;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
  };

  const texts = {
    pt: {
      rating: 'Avaliado 4.9/5 por 200K+ clientes',
      verified: 'Verificado há',
      min: 'min'
    },
    en: {
      rating: 'Rated 4.9/5 by 200K+ customers',
      verified: 'Verified',
      min: 'min ago'
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top Bar com Badges Dinâmicos */}
      <div className="bg-gray-50 py-2 overflow-hidden">
        <motion.div 
          className="flex space-x-8 animate-marquee"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {achievements.concat(achievements).map((achievement, index) => (
            <motion.div
              key={`${achievement.id}-${index}`}
              className="flex items-center space-x-2 text-sm text-gray-600 whitespace-nowrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SocialIcon platform={achievement.icon} size={16} className="text-primary" />
              <span className="font-medium">{achievement.text}</span>
              <span className="text-success text-xs">
                {language === 'pt' ? achievement.timestamp : `${texts.en.verified} ${achievement.timestamp.split(' ')[2]} ${texts.en.min}`}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Header Principal */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" aria-label="Página inicial" className="flex items-center space-x-3 group">
            <motion.div
              className="p-1 rounded-lg"
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {logoStep >= logoCandidates.length ? (
                <Rocket className="h-8 w-8 text-primary" />
              ) : (
                <img
                  src={logoCandidates[logoStep]}
                  alt="Gram Provider"
                  className="h-auto w-auto max-h-16 md:max-h-20 max-w-[200px] object-contain"
                  onError={() => setLogoStep(logoStep + 1)}
                />
              )}
            </motion.div>
            <div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="hidden md:inline">{texts[language].rating}</span>
              </div>
            </div>
          </Link>

          {/* Social Media Dropdown Menus */}
          <nav className="hidden md:flex items-center space-x-2">
            <DropdownMenu
              title={socialMenus.instagram.title}
              icon={socialMenus.instagram.icon}
              items={socialMenus.instagram.items}
            />
            <DropdownMenu
              title={socialMenus.tiktok.title}
              icon={socialMenus.tiktok.icon}
              items={socialMenus.tiktok.items}
            />
            <DropdownMenu
              title={socialMenus.youtube.title}
              icon={socialMenus.youtube.icon}
              items={socialMenus.youtube.items}
            />
            <DropdownMenu
              title={socialMenus.outros.title}
              icon={socialMenus.outros.icon}
              items={socialMenus.outros.items}
            />
          </nav>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
              </span>
            </motion.button>

            {/* CTA Button */}
            <Link to="/todos-os-servicos">
              <motion.button
                className="bg-viral hover:bg-viral-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {language === 'pt' ? 'Viralize Agora!' : 'Go Viral Now!'}
              </motion.button>
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-2">
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">
                {language === 'pt' ? 'PT' : 'EN'}
              </span>
            </motion.button>

            {/* Mobile Menu */}
            <MobileMenu socialMenus={[socialMenus.instagram, socialMenus.tiktok, socialMenus.youtube, socialMenus.outros]} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;