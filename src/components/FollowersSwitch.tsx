import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FollowersSwitchProps {
  current: 'world' | 'br';
  className?: string;
  worldPath?: string;
  brPath?: string;
  worldLabel?: string;
  brLabel?: string;
}

const FollowersSwitch: React.FC<FollowersSwitchProps> = ({
  current,
  className = '',
  worldPath = '/instagram/seguidores-mundiais',
  brPath = '/instagram/seguidores-brasileiros',
  worldLabel = 'Seguidores Mundiais',
  brLabel = 'Seguidores Brasileiros',
}) => {
  const navigate = useNavigate();

  const goWorld = () => navigate(worldPath, { replace: true });
  const goBrazil = () => navigate(brPath, { replace: true });

  return (
    <div
      className={`inline-flex rounded-full bg-gray-100 p-1 ${className}`}
      role="tablist"
      aria-label="Alternar tipo"
    >
      <button
        onClick={goWorld}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          current === 'world' ? 'bg-pink-600 text-white shadow' : 'text-gray-700 hover:bg-white'
        }`}
        aria-selected={current === 'world'}
      >
        {worldLabel}
      </button>
      <button
        onClick={goBrazil}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          current === 'br' ? 'bg-green-600 text-white shadow' : 'text-gray-700 hover:bg-white'
        }`}
        aria-selected={current === 'br'}
      >
        {brLabel}
      </button>
    </div>
  );
};

export default FollowersSwitch;