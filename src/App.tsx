/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, MapPin, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PetalsBackground } from './components/PetalsBackground';
import { CountdownTimer } from './components/CountdownTimer';
import { RsvpForm } from './components/RsvpForm';
import { EventDetails } from './components/EventDetails';
import { MenuSection } from './components/MenuSection';
import { AdminModal } from './components/AdminModal';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const weddingDate = '2026-11-21T16:30:00';

  const scrollToRsvp = () => {
    const element = document.getElementById('confirmacao');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2725] relative selection:bg-[#d4af37]/25 selection:text-[#8a6b18]">
      {/* Delicate floating background petals */}
      <PetalsBackground />

      {/* Navigation Bar */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} onScrollToRsvp={scrollToRsvp} />

      {/* Hero Section */}
      <section id="inicio" className="relative pt-8 pb-16 px-4 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#ece3d8] bg-neutral-900 min-h-[580px] sm:min-h-[640px] flex items-center justify-center text-center p-6 sm:p-12">
          {/* Background Hero Image */}
          <img
            src="/src/assets/images/wedding_hero_arch_1791497894788.jpg"
            alt="Cerimônia de Casamento ao Ar Livre"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
          />

          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />

          {/* Foreground Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-2xl text-white space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-widest uppercase font-medium text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convidamos você para celebrar</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
              Helena & Gabriel
            </h1>

            <p className="font-script text-2xl sm:text-3xl text-amber-100/90 tracking-wide">
              Com as bênçãos de nossos pais e a alegria de todos os que amamos
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-neutral-200 pt-2">
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-xs border border-white/10">
                <Calendar className="w-4 h-4 text-amber-300" />
                21 de Novembro de 2026 · 16:30
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-xs border border-white/10">
                <MapPin className="w-4 h-4 text-amber-300" />
                Capela dos Vinhedos · São Roque / SP
              </span>
            </div>

            {/* Countdown inside Hero banner */}
            <div className="pt-4">
              <CountdownTimer targetDate={weddingDate} />
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <motion.button
                type="button"
                onClick={scrollToRsvp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 py-3.5 px-8 rounded-full bg-[#d4af37] hover:bg-[#c29e2e] text-[#1f1807] font-semibold text-xs uppercase tracking-widest shadow-lg shadow-black/30 transition-all cursor-pointer"
              >
                <span>Confirmar Presença Agora</span>
                <ArrowDown className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event Details Section */}
      <EventDetails onScrollToRsvp={scrollToRsvp} />

      {/* Menu & Banquet Section */}
      <MenuSection />

      {/* RSVP Section */}
      <section className="py-12 bg-gradient-to-b from-transparent via-[#f5ede2]/50 to-transparent">
        <RsvpForm weddingDate={weddingDate} />
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#ece3d8] bg-[#f5ede2]/40 py-12 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <Heart className="w-6 h-6 text-[#8a6b18] mx-auto fill-[#8a6b18]/20 animate-pulse" />
          <blockquote className="font-serif italic text-lg sm:text-xl text-[#4a423d] leading-relaxed">
            &ldquo;O amor não se vê com os olhos, mas com o coração.&rdquo;
          </blockquote>
          <p className="text-xs uppercase tracking-widest text-[#8a7e74] font-medium">
            Helena & Gabriel · 2026
          </p>

          <div className="pt-6 border-t border-[#e8dfd5]/80 flex items-center justify-center gap-4 text-xs text-[#8a7e74]">
            <span>Esperamos por você com muito amor</span>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="text-[#8a6b18] hover:text-[#5d460d] font-semibold underline underline-offset-4 cursor-pointer"
            >
              Área dos Noivos (Lista de Convidados)
            </button>
          </div>
        </div>
      </footer>

      {/* Admin / Organizer Modal */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
