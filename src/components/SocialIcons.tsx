import React from 'react';
import { Users, Heart, MessageCircle, Eye, Share, Rocket } from 'lucide-react';
import kwaiLogoWhite from '../assets/kwai-logo-branco.png';

interface SocialIconProps {
  platform: string;
  size?: number;
  className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ platform, size = 24, className = "" }) => {
  const iconStyle = {
    width: size,
    height: size,
  };

  // Para ícones de achievement (header)
  if (['users', 'heart', 'message', 'eye', 'share', 'rocket'].includes(platform.toLowerCase())) {
    switch (platform.toLowerCase()) {
      case 'users':
        return <Users style={iconStyle} className={className} />;
      case 'heart':
        return <Heart style={iconStyle} className={className} />;
      case 'message':
        return <MessageCircle style={iconStyle} className={className} />;
      case 'eye':
        return <Eye style={iconStyle} className={className} />;
      case 'share':
        return <Share style={iconStyle} className={className} />;
      case 'rocket':
        return <Rocket style={iconStyle} className={className} />;
    }
  }

  // Para ícones de redes sociais
  switch (platform.toLowerCase()) {
    case 'instagram':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.584.07-4.849.148-3.228 1.658-4.771 4.919-4.919 1.265-.058 1.645-.07 4.849-.07zm0 1.534c-3.17 0-3.548.012-4.79.069-2.58.118-3.777 1.317-3.895 3.895-.057 1.242-.069 1.62-.069 4.79 0 3.168.012 3.547.069 4.79.118 2.575 1.314 3.777 3.895 3.895 1.242.057 1.62.069 4.79.069 3.169 0 3.547-.012 4.79-.069 2.58-.118 3.777-1.317 3.895-3.895.057-1.242.069-1.621.069-4.79 0-3.17-.012-3.548-.069-4.79-.118-2.575-1.314-3.777-3.895-3.895-1.243-.057-1.621-.069-4.79-.069zm0 3.116a5.187 5.187 0 1 1 0 10.374 5.187 5.187 0 0 1 0-10.374zm0 1.534a3.653 3.653 0 1 0 0 7.306 3.653 3.653 0 0 0 0-7.306zm5.406-.838a1.21 1.21 0 1 1 0 2.42 1.21 1.21 0 0 1 0-2.42z"/>
        </svg>
      );
    
    case 'tiktok':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      );
    
    case 'youtube':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432l6.545 3.568-6.545 3.568z"/>
        </svg>
      );
    
    case 'facebook':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    
    case 'twitter':
    case 'x':
    case 'twitter/x':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    
    case 'spotify':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.9-7.62-2.307-12.631-1.261-.48.121-.961-.179-1.081-.6-.12-.48.179-.96.6-1.08 5.52-1.141 10.302-.661 14.001 1.5.48.18.6.779.372 1.141zM9.6 9.6c-.66 0-1.2-.54-1.2-1.2 0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2 0 .66-.54 1.2-1.2 1.2z"/>
        </svg>
      );

    case 'threads':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11 1.018-6.57 2.978-1.39 1.86-2.105 4.458-2.132 7.759v.014c.028 3.3.743 5.899 2.132 7.759 1.46 1.96 3.66 2.956 6.57 2.978 4.4-.03 7.2-2.056 8.304-6.015l2.04.57c-.651 2.336-1.832 4.177-3.51 5.467-1.782 1.373-4.08 2.078-6.826 2.098z"/>
        </svg>
      );

    case 'reddit':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.118 3.118 0 0 1 .029.45c0 2.648-2.943 4.796-6.57 4.796-3.628 0-6.57-2.148-6.57-4.796 0-.153.012-.305.028-.45-1.702-.813-1.34-3.265.746-3.31.477 0 .9.182 1.207.49a7.89 7.89 0 0 1 4.656-1.488l.67-3.146a.832.832 0 0 1 .938-.649l3.41.716a1.25 1.25 0 0 1 1.112-.696z"/>
        </svg>
      );
    
    case 'kwai':
      return (
        <img src={kwaiLogoWhite} alt="Kwai" style={iconStyle} className={className} />
      );
    
    default:
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      );
  }
};

export { SocialIcon };