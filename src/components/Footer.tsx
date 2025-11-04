import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, MessageCircle, Shield, Award, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { SocialIcon } from './SocialIcons';

const Footer: React.FC = () => {
  const mediaLogos = [
    { name: 'Instagram', logo: 'instagram', color: 'text-pink-500' },
    { name: 'TikTok', logo: 'tiktok', color: 'text-black' },
    { name: 'YouTube', logo: 'youtube', color: 'text-red-500' },
    { name: 'Facebook', logo: 'facebook', color: 'text-blue-600' },
    { name: 'Twitter/X', logo: 'twitter', color: 'text-gray-800' },
    { name: 'Spotify', logo: 'spotify', color: 'text-green-500' },
    { name: 'Threads', logo: 'threads', color: 'text-black' },
    { name: 'Reddit', logo: 'reddit', color: 'text-orange-500' },
  ];

  const trustBadges = [
    { icon: Shield, text: '100% Seguro', subtext: 'SSL Certificado' },
    { icon: Award, text: '4.9/5 Estrelas', subtext: '200K+ Avaliações' },
    { icon: Clock, text: '24/7 Suporte', subtext: 'Atendimento Rápido' },
    { icon: Users, text: '500K+ Clientes', subtext: 'Satisfeitos' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Badges Section */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-3 bg-success rounded-lg">
                  <badge.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">{badge.text}</div>
                  <div className="text-sm text-gray-300">{badge.subtext}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Logos Section */}
      <div className="py-8 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-xl font-semibold mb-6">
            Plataformas Suportadas
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {mediaLogos.map((media, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <SocialIcon platform={media.logo} size={24} className={media.color} />
                <span className="font-medium">{media.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/gramprovider-logo.png"
                  alt="GramProvider"
                  className="h-10 md:h-12 w-auto object-contain"
                />
                <h3 className="text-2xl font-bold">GramProvider</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                A maior plataforma de crescimento viral orgânico do Brasil. 
                Conectamos você com influenciadores reais para crescimento autêntico.
              </p>
              {/* Destaque removido conforme solicitação */}
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/instagram" className="text-gray-300 hover:text-white transition-colors">Instagram</Link></li>
                <li><Link to="/tiktok" className="text-gray-300 hover:text-white transition-colors">TikTok</Link></li>
                <li><Link to="/youtube" className="text-gray-300 hover:text-white transition-colors">YouTube</Link></li>
                <li><Link to="/facebook" className="text-gray-300 hover:text-white transition-colors">Facebook</Link></li>
                <li><Link to="/twitter" className="text-gray-300 hover:text-white transition-colors">Twitter/X</Link></li>
                <li><Link to="/todos-os-servicos" className="text-viral hover:text-viral-400 transition-colors">Ver Todos</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/perguntas" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contato" className="text-gray-300 hover:text-white transition-colors">Contato</Link></li>
                <li><Link to="/termos" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacidade" className="text-gray-300 hover:text-white transition-colors">Privacidade</Link></li>
                <li><Link to="/reembolso" className="text-gray-300 hover:text-white transition-colors">Política de Reembolso</Link></li>
              </ul>
            </div>

            {/* Contact & Live Chat */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Atendimento</h4>
              <div className="space-y-4">
                <motion.button
                  className="flex items-center space-x-2 bg-success hover:bg-success-600 text-white px-4 py-2 rounded-lg transition-all w-full justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Chat ao Vivo</span>
                </motion.button>
                <div className="text-sm text-gray-300">
                  <p>📧 suporte@gramprovider.com</p>
                  <p>📱 WhatsApp: (31) 98358-4949</p>
                  <p>🕒 Seg-Sex: 8h às 18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 GramProvider. Todos os diretios reservados
             </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>🔒 Pagamentos Seguros</span>
              <span>🚀 Entrega Instantânea</span>
              <span>✅ Garantia de Qualidade</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;