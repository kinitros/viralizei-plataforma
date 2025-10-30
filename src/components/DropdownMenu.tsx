import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SocialIcon } from './SocialIcons';

interface DropdownItem {
  label: string;
  path: string;
  icon?: string;
}

interface DropdownMenuProps {
  title: string;
  icon: string;
  items: DropdownItem[];
  className?: string;
  isMobile?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, icon, items, className = '', isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    if (isMobileDevice || isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobileDevice && !isMobile) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobileDevice && !isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button 
        onClick={handleToggle}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary font-medium transition-colors group w-full justify-between md:justify-start"
      >
        <div className="flex items-center space-x-2">
          <SocialIcon platform={icon} size={20} />
          <span>{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              ${isMobileDevice || isMobile 
                ? 'static w-full mt-2 bg-gray-50 rounded-lg border-l-4 border-primary' 
                : 'absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100'
              } py-2 z-50
            `}
          >
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => isMobileDevice && setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-primary transition-colors
                  ${isMobileDevice || isMobile 
                    ? 'hover:bg-gray-100 border-b border-gray-200 last:border-b-0' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                {item.icon && <SocialIcon platform={item.icon} size={16} />}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;