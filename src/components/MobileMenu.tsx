import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import DropdownMenu from './DropdownMenu';

interface MobileMenuProps {
  socialMenus: Array<{
    title: string;
    icon: string;
    items: Array<{
      label: string;
      path: string;
      icon?: string;
    }>;
  }>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ socialMenus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-700 hover:text-primary transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMenu}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                <button
                  onClick={closeMenu}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-2">
                {/* Social Media Dropdowns */}
                {socialMenus.map((menu, index) => (
                  <DropdownMenu
                    key={index}
                    title={menu.title}
                    icon={menu.icon}
                    items={menu.items}
                    isMobile={true}
                    className="border-b border-gray-100 pb-2 mb-2 last:border-b-0"
                  />
                ))}

                {/* Additional Links */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/descontos"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Descontos
                  </Link>
                  <Link
                    to="/faq"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/ferramentas"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Ferramentas
                  </Link>
                  <Link
                    to="/carreiras"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Carreiras
                  </Link>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link
                    to="/viralizar-instagram"
                    onClick={closeMenu}
                    className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold text-center hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Viralizar Agora
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;