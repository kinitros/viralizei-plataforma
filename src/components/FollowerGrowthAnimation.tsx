import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, MessageCircle, Share2, Plus, TrendingUp } from 'lucide-react';

interface Follower {
  id: string;
  name: string;
  avatar: string;
  timestamp: number;
}

interface ProfileStats {
  followers: number;
  likes: number;
  comments: number;
  shares: number;
}

const FollowerGrowthAnimation: React.FC = () => {
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    followers: 12847,
    likes: 45632,
    comments: 2341,
    shares: 1876
  });

  const [recentFollowers, setRecentFollowers] = useState<Follower[]>([]);
  const [pulseEffect, setPulseEffect] = useState(false);

  // Nomes brasileiros fictícios para os seguidores
  const followerNames = [
    'Ana Silva', 'Carlos Santos', 'Maria Oliveira', 'João Costa', 'Fernanda Lima',
    'Pedro Alves', 'Juliana Rocha', 'Rafael Mendes', 'Camila Ferreira', 'Lucas Barbosa',
    'Beatriz Cardoso', 'Gabriel Souza', 'Larissa Pereira', 'Thiago Ribeiro', 'Amanda Dias',
    'Bruno Martins', 'Isabela Gomes', 'Mateus Araújo', 'Letícia Nascimento', 'Diego Moreira',
    'Sophia Almeida', 'Enzo Carvalho', 'Valentina Rodrigues', 'Matheus Fernandes', 'Laura Pinto',
    'Guilherme Castro', 'Manuela Ramos', 'Bernardo Azevedo', 'Alice Cavalcanti', 'Miguel Correia'
  ];

  // Gerar avatar único para cada seguidor
  const generateAvatar = (name: string) => {
    const encodedName = encodeURIComponent(`brazilian person ${name} profile photo headshot`);
    return `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedName}&image_size=square`;
  };

  // Simular crescimento de seguidores
  useEffect(() => {
    const interval = setInterval(() => {
      // Adicionar novos seguidores
      const newFollowerCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < newFollowerCount; i++) {
        setTimeout(() => {
          const randomName = followerNames[Math.floor(Math.random() * followerNames.length)];
          const newFollower: Follower = {
            id: `${Date.now()}-${Math.random()}`,
            name: randomName,
            avatar: generateAvatar(randomName),
            timestamp: Date.now()
          };

          // Atualizar estatísticas
          setProfileStats(prev => ({
            followers: prev.followers + 1,
            likes: prev.likes + Math.floor(Math.random() * 10) + 1,
            comments: prev.comments + Math.floor(Math.random() * 3),
            shares: prev.shares + Math.floor(Math.random() * 2)
          }));

          // Adicionar à lista de seguidores recentes
          setRecentFollowers(prev => [newFollower, ...prev.slice(0, 4)]);

          // Ativar efeito de pulso
          setPulseEffect(true);
          setTimeout(() => setPulseEffect(false), 600);

        }, i * 500);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-sm mx-auto border border-gray-700/50">
      {/* Efeitos de partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-viral/30 rounded-full"
            initial={{ 
              x: Math.random() * 300, 
              y: Math.random() * 400,
              scale: 0 
            }}
            animate={{ 
              y: -30,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Perfil Principal */}
      <div className="relative z-10">
        {/* Avatar e Info do Perfil */}
        <div className="text-center mb-4">
          <motion.div
            className={`relative inline-block ${pulseEffect ? 'animate-pulse' : ''}`}
            animate={pulseEffect ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20brazilian%20influencer%20smiling%20profile%20photo&image_size=square"
              alt="Perfil Viralizei"
              className="w-16 h-16 rounded-full border-3 border-viral shadow-lg"
            />
            {/* Indicador de crescimento */}
            <motion.div
              className="absolute -top-1 -right-1 bg-success text-white rounded-full p-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <TrendingUp size={12} />
            </motion.div>
          </motion.div>
          
          <h3 className="font-bold text-base mt-2 text-gray-100">@viralizei_oficial</h3>
          <p className="text-gray-400 text-xs">Influenciador Digital</p>
        </div>

        {/* Estatísticas com Animação */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div 
            className="text-center p-2 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-700/50"
            animate={pulseEffect ? { scale: [1, 1.05, 1] } : {}}
          >
            <div className="flex items-center justify-center mb-1">
              <Users className="text-viral mr-1" size={14} />
              <span className="font-bold text-sm text-gray-100">
                {profileStats.followers.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-400">Seguidores</p>
          </motion.div>

          <motion.div 
            className="text-center p-2 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-700/50"
            animate={pulseEffect ? { scale: [1, 1.05, 1] } : {}}
          >
            <div className="flex items-center justify-center mb-1">
              <Heart className="text-red-400 mr-1" size={14} />
              <span className="font-bold text-sm text-gray-100">
                {profileStats.likes.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-400">Likes</p>
          </motion.div>

          <motion.div 
            className="text-center p-2 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-700/50"
            animate={pulseEffect ? { scale: [1, 1.05, 1] } : {}}
          >
            <div className="flex items-center justify-center mb-1">
              <MessageCircle className="text-blue-400 mr-1" size={14} />
              <span className="font-bold text-sm text-white">
                {profileStats.comments.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-blue-100">Comentários</p>
          </motion.div>

          <motion.div 
            className="text-center p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"
            animate={pulseEffect ? { scale: [1, 1.05, 1] } : {}}
          >
            <div className="flex items-center justify-center mb-1">
              <Share2 className="text-green-400 mr-1" size={14} />
              <span className="font-bold text-sm text-white">
                {profileStats.shares.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-blue-100">Compartilhamentos</p>
          </motion.div>
        </div>

        {/* Lista de Seguidores Recentes */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">Novos Seguidores</h4>
          <div className="space-y-1">
            {recentFollowers.slice(0, 3).map((follower) => (
              <motion.div
                key={follower.id}
                className="flex items-center space-x-2 p-1.5 bg-black/20 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={follower.avatar}
                  alt={follower.name}
                  className="w-6 h-6 rounded-full border border-gray-600/50"
                />
                <span className="text-xs text-gray-200 font-medium flex-1 truncate">
                  {follower.name}
                </span>
                <Plus className="text-success" size={12} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Indicador de Crescimento Viral */}
        <motion.div
          className="text-center p-2 bg-gradient-to-r from-viral to-success rounded-lg"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-center space-x-1">
            <TrendingUp className="text-white" size={14} />
            <span className="text-xs font-bold text-white">Crescimento Viral Ativo</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FollowerGrowthAnimation;