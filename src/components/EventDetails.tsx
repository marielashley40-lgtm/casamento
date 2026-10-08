import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Clock,
  Shirt,
  Gift,
  Copy,
  Check,
  Calendar,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface EventDetailsProps {
  onScrollToRsvp: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ onScrollToRsvp }) => {
  const [copiedPix, setCopiedPix] = useState(false);
  const pixKey = 'casamentohelenaegabriel@pix.com.br';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  return (
    <section id="detalhes" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="font-script text-3xl sm:text-4xl text-[#8a6b18] block mb-1">
          Informações & Programação
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c2725] tracking-tight">
          Detalhes do Nosso Grande Dia
        </h2>
        <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-3 rounded-full" />
      </div>

      {/* Grid of Event Locations & Program */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Cerimônia Card */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-[#ece3d8] shadow-xs overflow-hidden flex flex-col"
        >
          <div className="relative h-56 overflow-hidden bg-neutral-100">
            <img
              src="/src/assets/images/wedding_reception_tables_1791497904225.jpg"
              alt="Local da Celebração do Casamento"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-xs uppercase tracking-widest font-medium text-amber-200">
                A Cerimônia
              </span>
              <h3 className="text-2xl font-serif font-bold">Capela dos Vinhedos</h3>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5 text-sm text-[#554d46]">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#8a6b18] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2c2725] block">Horário da Cerimônia</strong>
                  <span>Sábado, 21 de Novembro de 2026 às 16:30</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#8a6b18] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2c2725] block">Endereço</strong>
                  <span>Estrada do Vinho, km 12 - São Roque / SP</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ece3d8] flex items-center justify-between">
              <span className="text-xs text-[#8a7e74]">Pedimos 20 min de antecedência</span>
              <a
                href="https://maps.google.com/?q=Estrada+do+Vinho+Sao+Roque"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a6b18] hover:text-[#6a5110] transition-colors"
              >
                Abrir no Mapa
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Festa & Recepção Card */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-[#ece3d8] shadow-xs overflow-hidden flex flex-col"
        >
          <div className="relative h-56 overflow-hidden bg-neutral-100">
            <img
              src="/src/assets/images/wedding_rings_detail_1791497913546.jpg"
              alt="Recepção e Jantar de Casamento"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-xs uppercase tracking-widest font-medium text-amber-200">
                A Recepção
              </span>
              <h3 className="text-2xl font-serif font-bold">Espaço Terraço Garden</h3>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5 text-sm text-[#554d46]">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#8a6b18] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2c2725] block">Coquetel & Jantar</strong>
                  <span>Logo após a cerimônia, das 18:00 às 02:00</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#8a6b18] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2c2725] block">Comemoração</strong>
                  <span>Música ao vivo, jantar empratado, drinks e pista de dança</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ece3d8] flex items-center justify-between">
              <span className="text-xs text-[#8a7e74]">Estacionamento com manobrista no local</span>
              <button
                type="button"
                onClick={onScrollToRsvp}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a6b18] hover:text-[#6a5110] transition-colors cursor-pointer"
              >
                Garantir Presença
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Traje & Lista de Presentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dress Code */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#fcfaf7] border border-[#ece3d8] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white border border-[#e8dfd5] flex items-center justify-center text-[#8a6b18] mb-4">
              <Shirt className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2c2725] mb-2">
              Traje: Passeio Completo / Esporte Fino
            </h3>
            <p className="text-sm text-[#736a64] leading-relaxed mb-4">
              Para a nossa celebração campestre ao entardecer, sugerimos trajes elegantes e confortáveis.
              Como a cerimônia ocorrerá em área com gramado, indicamos sapatos de salto bloco para as convidadas.
            </p>
          </div>
          <div className="pt-4 border-t border-[#ece3d8]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8a7e74] block mb-2">
              Paleta sugerida (Tons Suaves e Naturais)
            </span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#e3d7bf] border border-black/10 inline-block" title="Champagne" />
              <span className="w-6 h-6 rounded-full bg-[#c2b29f] border border-black/10 inline-block" title="Nude Fendi" />
              <span className="w-6 h-6 rounded-full bg-[#9ba79b] border border-black/10 inline-block" title="Verde Sálvia" />
              <span className="w-6 h-6 rounded-full bg-[#9aa6b2] border border-black/10 inline-block" title="Azul Serenity" />
              <span className="w-6 h-6 rounded-full bg-[#d8a48f] border border-black/10 inline-block" title="Terracota Claro" />
              <span className="text-xs text-[#8a7e74] ml-2 italic">Pedimos que reservem o branco para a noiva ♡</span>
            </div>
          </div>
        </div>

        {/* Presentes & PIX */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#fcfaf7] border border-[#ece3d8] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white border border-[#e8dfd5] flex items-center justify-center text-[#8a6b18] mb-4">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2c2725] mb-2">
              Mimos & Presente dos Noivos
            </h3>
            <p className="text-sm text-[#736a64] leading-relaxed mb-4">
              O maior presente é compartilhar este momento inesquecível com você! Caso deseje nos
              presentear com nossa lua de mel e novo lar, disponibilizamos nossa chave PIX:
            </p>
          </div>

          <div className="pt-4 border-t border-[#ece3d8]">
            <div className="p-3 bg-white rounded-xl border border-[#e8dfd5] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="block text-[11px] uppercase tracking-wider text-[#8a7e74] font-medium">
                  Chave PIX (E-mail)
                </span>
                <span className="text-xs sm:text-sm font-mono text-[#2c2725] truncate block">
                  {pixKey}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyPix}
                className="shrink-0 py-2 px-3.5 rounded-lg bg-[#faf8f5] hover:bg-[#f3ede3] text-[#2c2725] border border-[#e0d6c9] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedPix ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8a6b18]" />
                    <span>Copiar PIX</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
