import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Send,
  Users,
  Utensils,
  Share2,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { submitRsvp } from '../lib/supabase';
import { RsvpEntry } from '../types/wedding';

interface RsvpFormProps {
  onRsvpSubmitted?: (newEntry: RsvpEntry) => void;
  weddingDate: string;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({ onRsvpSubmitted, weddingDate }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [presenca, setPresenca] = useState<'confirmado' | 'recusado'>('confirmado');
  const [acompanhantes, setAcompanhantes] = useState<number>(0);
  const [nomesAcompanhantes, setNomesAcompanhantes] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [restricoesDetalhe, setRestricoesDetalhe] = useState('');

  const DIETARY_OPTIONS = [
    'Nenhuma',
    'Vegetariano',
    'Vegano',
    'Sem Lactose',
    'Sem Glúten (Celíaco)',
    'Alergia a Frutos do Mar',
    'Alergia a Nozes / Castanhas',
    'Outra restrição',
  ];

  const handleToggleRestriction = (opt: string) => {
    if (opt === 'Nenhuma') {
      setSelectedRestrictions(['Nenhuma']);
      setRestricoesDetalhe('');
      return;
    }

    let updated = selectedRestrictions.filter((o) => o !== 'Nenhuma');
    if (updated.includes(opt)) {
      updated = updated.filter((o) => o !== opt);
    } else {
      updated.push(opt);
    }
    setSelectedRestrictions(updated);
  };

  const getCombinedRestrictions = () => {
    if (selectedRestrictions.length === 0 || selectedRestrictions.includes('Nenhuma')) {
      return '';
    }
    const list = [...selectedRestrictions];
    if (restricoesDetalhe.trim()) {
      list.push(`Detalhes: ${restricoesDetalhe.trim()}`);
    }
    return list.join(', ');
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<RsvpEntry | null>(null);

  // Phone input formatting helper: (XX) XXXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setTelefone(value);
  };

  const triggerConfettiCelebration = () => {
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#d4af37', '#f6e05e', '#f472b6', '#ffffff', '#e2e8f0'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {
      console.log('Confetti effect executed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nome.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (!telefone.trim() || telefone.length < 10) {
      setErrorMessage('Por favor, informe seu telefone com DDD.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitRsvp({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        presenca,
        acompanhantes: presenca === 'confirmado' ? acompanhantes : 0,
        nomes_acompanhantes: presenca === 'confirmado' ? nomesAcompanhantes.trim() : '',
        mensagem: mensagem.trim(),
        restricoes: presenca === 'confirmado' ? getCombinedRestrictions() : '',
      });

      if (result.success && result.data) {
        setConfirmedData(result.data);
        setIsSuccess(true);
        if (presenca === 'confirmado') {
          triggerConfettiCelebration();
        }
        if (onRsvpSubmitted) {
          onRsvpSubmitted(result.data);
        }
      } else {
        setErrorMessage('Houve uma instabilidade ao salvar. Tente novamente.');
      }
    } catch (err: any) {
      setErrorMessage('Erro ao enviar confirmação. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setPresenca('confirmado');
    setAcompanhantes(0);
    setNomesAcompanhantes('');
    setMensagem('');
    setSelectedRestrictions([]);
    setRestricoesDetalhe('');
    setIsSuccess(false);
    setConfirmedData(null);
  };

  // Google Calendar Link generator
  const createGoogleCalendarLink = () => {
    const startDate = '20261121T193000Z';
    const endDate = '20261122T040000Z';
    const title = encodeURIComponent('Casamento de Helena & Gabriel');
    const details = encodeURIComponent('Celebração de casamento com cerimônia e festa.');
    const location = encodeURIComponent('Capela dos Vinhedos & Espaço Terraço Garden - São Roque/SP');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  return (
    <div id="confirmacao" className="w-full max-w-2xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="rsvp-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl shadow-xl shadow-[#2c2725]/5 border border-[#ece3d8] p-6 sm:p-10 relative overflow-hidden"
          >
            {/* Elegant top floral accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#e8dfd5] via-[#d4af37] to-[#e8dfd5]" />

            <div className="text-center mb-8">
              <span className="font-script text-3xl sm:text-4xl text-[#8a6b18] block mb-1">
                R.S.V.P.
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2c2725] tracking-tight">
                Confirmação de Presença
              </h2>
              <p className="text-sm text-[#736a64] mt-2 max-w-md mx-auto">
                Sua presença tornará o nosso dia inesquecível. Por favor, confirme até{' '}
                <strong className="text-[#2c2725] font-semibold">01 de Novembro de 2026</strong>.
              </p>
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Presença Selection Cards */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736a64] mb-2.5">
                  Você poderá comparecer? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPresenca('confirmado')}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      presenca === 'confirmado'
                        ? 'border-[#8a6b18] bg-[#fbf8f0] ring-1 ring-[#8a6b18]'
                        : 'border-[#e8dfd5] bg-white hover:bg-[#faf8f5]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        presenca === 'confirmado'
                          ? 'border-[#8a6b18] bg-[#8a6b18] text-white'
                          : 'border-[#cfc4b8]'
                      }`}
                    >
                      {presenca === 'confirmado' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-[#2c2725]">
                        Sim, confirmo presença!
                      </span>
                      <span className="block text-xs text-[#8a7e74]">
                        Celebrarei este dia com vocês
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPresenca('recusado');
                      setAcompanhantes(0);
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      presenca === 'recusado'
                        ? 'border-neutral-500 bg-neutral-50 ring-1 ring-neutral-400'
                        : 'border-[#e8dfd5] bg-white hover:bg-[#faf8f5]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        presenca === 'recusado'
                          ? 'border-neutral-700 bg-neutral-700 text-white'
                          : 'border-[#cfc4b8]'
                      }`}
                    >
                      {presenca === 'recusado' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-[#2c2725]">
                        Não poderei comparecer
                      </span>
                      <span className="block text-xs text-[#8a7e74]">
                        Enviarei energias de longe
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Nome Completo */}
              <div>
                <label
                  htmlFor="nome"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#736a64] mb-1.5"
                >
                  Nome Completo *
                </label>
                <input
                  id="nome"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Amanda Beatriz de Oliveira"
                  className="w-full px-4 py-3 rounded-xl border border-[#dcd2c5] bg-[#faf8f5]/60 text-[#2c2725] placeholder:text-[#a89d93] focus:outline-none focus:ring-2 focus:ring-[#8a6b18]/40 focus:border-[#8a6b18] transition-all text-sm"
                />
              </div>

              {/* Email & Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#736a64] mb-1.5"
                  >
                    E-mail *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amanda@exemplo.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#dcd2c5] bg-[#faf8f5]/60 text-[#2c2725] placeholder:text-[#a89d93] focus:outline-none focus:ring-2 focus:ring-[#8a6b18]/40 focus:border-[#8a6b18] transition-all text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefone"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#736a64] mb-1.5"
                  >
                    Telefone / WhatsApp *
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    required
                    value={telefone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 98765-4321"
                    className="w-full px-4 py-3 rounded-xl border border-[#dcd2c5] bg-[#faf8f5]/60 text-[#2c2725] placeholder:text-[#a89d93] focus:outline-none focus:ring-2 focus:ring-[#8a6b18]/40 focus:border-[#8a6b18] transition-all text-sm tabular-nums"
                  />
                </div>
              </div>

              {/* Acompanhantes (somente se confirmado) */}
              {presenca === 'confirmado' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-1 border-t border-[#ece3d8]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#736a64] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#8a6b18]" />
                        Quantos acompanhantes irão com você?
                      </label>
                      <span className="text-xs text-[#8a7e74] tabular-nums font-medium">
                        {acompanhantes === 0 ? 'Apenas eu' : `+${acompanhantes} pessoa(s)`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAcompanhantes(num)}
                          className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                            acompanhantes === num
                              ? 'bg-[#8a6b18] text-white border-[#8a6b18] shadow-xs'
                              : 'bg-white border-[#e8dfd5] text-[#554d46] hover:bg-[#faf8f5]'
                          }`}
                        >
                          {num === 0 ? 'Nenhum' : `+${num}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {acompanhantes > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label
                        htmlFor="nomesAcompanhantes"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#736a64] mb-1.5"
                      >
                        Nome(s) do(s) acompanhante(s)
                      </label>
                      <input
                        id="nomesAcompanhantes"
                        type="text"
                        value={nomesAcompanhantes}
                        onChange={(e) => setNomesAcompanhantes(e.target.value)}
                        placeholder="Ex: João da Silva e Helena de Oliveira"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#dcd2c5] bg-[#faf8f5]/60 text-[#2c2725] placeholder:text-[#a89d93] focus:outline-none focus:ring-2 focus:ring-[#8a6b18]/40 focus:border-[#8a6b18] transition-all text-sm"
                      />
                    </motion.div>
                  )}

                  {/* Restrições Alimentares com opções clicáveis */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#736a64] mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[#8a6b18]" />
                        Restrições alimentares ou alergias?
                      </span>
                      <span className="text-[11px] text-[#8a7e74] font-normal">
                        (Você ou acompanhantes)
                      </span>
                    </label>

                    {/* Opções em formato de botões de seleção */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
                      {DIETARY_OPTIONS.map((opt) => {
                        const isSelected = selectedRestrictions.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleToggleRestriction(opt)}
                            className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                              isSelected
                                ? 'bg-[#8a6b18] text-white border-[#8a6b18] shadow-xs'
                                : 'bg-white border-[#e8dfd5] text-[#554d46] hover:bg-[#faf8f5]'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Campo de especificação se 'Outra restrição' for marcada ou para detalhes */}
                    {(selectedRestrictions.includes('Outra restrição') ||
                      (selectedRestrictions.length > 0 && !selectedRestrictions.includes('Nenhuma'))) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2"
                      >
                        <input
                          id="restricoesDetalhe"
                          type="text"
                          value={restricoesDetalhe}
                          onChange={(e) => setRestricoesDetalhe(e.target.value)}
                          placeholder="Detalhes adicionais (ex: alergia severa a camarão ou amendoim...)"
                          className="w-full px-4 py-2 rounded-xl border border-[#dcd2c5] bg-[#faf8f5]/60 text-[#2c2725] placeholder:text-[#a89d93] focus:outline-none focus:ring-2 focus:ring-[#8a6b18]/40 focus:border-[#8a6b18] transition-all text-xs"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Mensagem de carinho */}
              <div>
                <label
                  htmlFor="mensagem"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#736a64] mb-1.5 flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-[#8a6b18]" />
                  Mensagem aos noivos (Opcional)
                </label>
                <textarea
                  id="mensagem"
                  rows={3}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Deixe uma mensagem especial ou votos de carinho para o casal..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dcd2c5] bg-[#faf8f5]/60 text-[#2c2725] placeholder:text-[#a89d93] focus:outline-none focus:ring-2 focus:ring-[#8a6b18]/40 focus:border-[#8a6b18] transition-all text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 px-6 rounded-xl bg-[#2c2725] hover:bg-[#1a1715] text-[#fbf8f0] font-medium text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#d4af37]" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Salvando confirmação...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>Confirmar Agora</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          /* Confirmation Success Card */
          <motion.div
            key="rsvp-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl shadow-[#2c2725]/5 border border-[#ece3d8] p-6 sm:p-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#8a6b18] to-[#d4af37]" />

            <div className="w-16 h-16 rounded-full bg-[#fbf8f0] border border-[#d4af37]/40 flex items-center justify-center mx-auto mb-4 text-[#8a6b18]">
              <Heart className="w-8 h-8 fill-[#8a6b18]/20" />
            </div>

            <span className="font-script text-3xl sm:text-4xl text-[#8a6b18] block mb-1">
              {confirmedData?.presenca === 'confirmado' ? 'Muito Obrigado!' : 'Agradecemos o Carinho!'}
            </span>

            <h3 className="text-2xl font-serif font-bold text-[#2c2725] mb-2">
              {confirmedData?.presenca === 'confirmado'
                ? 'Presença Confirmada com Sucesso!'
                : 'Resposta Registrada com Sucesso'}
            </h3>

            <p className="text-sm text-[#736a64] max-w-md mx-auto mb-6">
              {confirmedData?.presenca === 'confirmado'
                ? `Olá, ${confirmedData.nome}! Seu lugar foi reservado com muito amor. Estamos ansiosos para celebrar este momento ao seu lado!`
                : `Olá, ${confirmedData?.nome}! Sentiremos sua falta, mas guardamos seu carinho em nossos corações.`}
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#faf8f5] rounded-xl p-4 sm:p-5 border border-[#e8dfd5] text-left max-w-md mx-auto mb-6 space-y-2.5 text-xs text-[#554d46]">
              <div className="flex justify-between pb-2 border-b border-[#e8dfd5]/60">
                <span className="text-[#8a7e74]">Convidado(a):</span>
                <span className="font-semibold text-[#2c2725]">{confirmedData?.nome}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#e8dfd5]/60">
                <span className="text-[#8a7e74]">E-mail:</span>
                <span className="text-[#2c2725]">{confirmedData?.email}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#e8dfd5]/60">
                <span className="text-[#8a7e74]">Telefone:</span>
                <span className="text-[#2c2725] tabular-nums">{confirmedData?.telefone}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#e8dfd5]/60">
                <span className="text-[#8a7e74]">Status:</span>
                <span
                  className={`font-semibold ${
                    confirmedData?.presenca === 'confirmado' ? 'text-emerald-700' : 'text-neutral-700'
                  }`}
                >
                  {confirmedData?.presenca === 'confirmado' ? 'Presença Confirmada' : 'Não comparecerá'}
                </span>
              </div>
              {confirmedData?.presenca === 'confirmado' && (
                <div className="flex justify-between">
                  <span className="text-[#8a7e74]">Total de pessoas:</span>
                  <span className="font-semibold text-[#2c2725] tabular-nums">
                    {(confirmedData.acompanhantes || 0) + 1} pessoa(s)
                  </span>
                </div>
              )}
            </div>

            {/* Actions: Add to Calendar and New RSVP */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {confirmedData?.presenca === 'confirmado' && (
                <a
                  href={createGoogleCalendarLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-[#8a6b18] hover:bg-[#745811] text-white text-xs font-semibold tracking-wide transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Salvar na Minha Agenda
                </a>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl border border-[#dcd2c5] bg-white hover:bg-[#faf8f5] text-[#554d46] text-xs font-medium transition-colors cursor-pointer"
              >
                Confirmar Outro Convidado
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
