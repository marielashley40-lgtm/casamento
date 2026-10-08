import React from 'react';
import { motion } from 'motion/react';
import { Settings2, Heart } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onScrollToRsvp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onScrollToRsvp }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#ece3d8] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#2c2725] hover:text-[#8a6b18] transition-colors"
        >
          Helena & Gabriel
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-[#736a64]">
          <a href="#inicio" className="hover:text-[#2c2725] transition-colors">
            Início
          </a>
          <a href="#detalhes" className="hover:text-[#2c2725] transition-colors">
            Cerimônia & Festa
          </a>
          <a href="#cardapio" className="hover:text-[#2c2725] transition-colors">
            Cardápio
          </a>
          <a href="#detalhes" className="hover:text-[#2c2725] transition-colors">
            Traje & Presentes
          </a>
          <a href="#confirmacao" className="hover:text-[#2c2725] transition-colors">
            R.S.V.P.
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Painel dos Noivos"
            className="p-2 text-[#736a64] hover:text-[#2c2725] hover:bg-white rounded-lg border border-transparent hover:border-[#ece3d8] transition-colors cursor-pointer"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <motion.button
            type="button"
            onClick={onScrollToRsvp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white bg-[#2c2725] hover:bg-black rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
          >
            Confirmar Presença
          </motion.button>
        </div>
      </div>
    </header>
  );
};
