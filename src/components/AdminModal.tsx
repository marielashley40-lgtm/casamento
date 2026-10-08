import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Download,
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  Heart,
} from 'lucide-react';
import { fetchAllRsvps, removeRsvp } from '../lib/supabase';
import { RsvpEntry } from '../types/wedding';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPresence, setFilterPresence] = useState<'all' | 'confirmado' | 'recusado'>('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchAllRsvps();
      setRsvps(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Deseja realmente remover a confirmação de ${name}?`)) {
      await removeRsvp(id);
      setRsvps((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const exportToCSV = () => {
    if (rsvps.length === 0) return;

    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Presenca',
      'Acompanhantes',
      'Nomes Acompanhantes',
      'Mensagem',
      'Restricoes',
      'Data',
    ];
    const rows = rsvps.map((r) => [
      `"${r.nome.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.telefone.replace(/"/g, '""')}"`,
      r.presenca,
      r.acompanhantes,
      `"${(r.nomes_acompanhantes || '').replace(/"/g, '""')}"`,
      `"${(r.mensagem || '').replace(/"/g, '""')}"`,
      `"${(r.restricoes || '').replace(/"/g, '""')}"`,
      r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `confirmacoes_casamento_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.telefone.includes(searchTerm);
    const matchesFilter = filterPresence === 'all' || r.presenca === filterPresence;
    return matchesSearch && matchesFilter;
  });

  // Key metrics
  const confirmedList = rsvps.filter((r) => r.presenca === 'confirmado');
  const declinedList = rsvps.filter((r) => r.presenca === 'recusado');
  const totalGuests = confirmedList.reduce(
    (acc, curr) => acc + 1 + (Number(curr.acompanhantes) || 0),
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#ece3d8] max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#ece3d8] flex items-center justify-between bg-[#faf8f5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#e8dfd5] flex items-center justify-center text-[#8a6b18]">
              <Heart className="w-5 h-5 fill-[#8a6b18]/20" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#2c2725]">
                Painel dos Noivos
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#8a7e74]">
                <span>Lista Oficial de Presenças</span>
                <span>·</span>
                <span>Helena & Gabriel</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#736a64] hover:text-[#2c2725] rounded-xl hover:bg-white border border-transparent hover:border-[#ece3d8] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metrics cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#ece3d8]">
              <span className="text-[11px] uppercase tracking-wider text-[#8a7e74] font-medium block">
                Total Confirmados
              </span>
              <span className="text-2xl font-serif font-bold text-[#2c2725] tabular-nums">
                {confirmedList.length}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-medium block">
                Pessoas Totais
              </span>
              <span className="text-2xl font-serif font-bold text-emerald-900 tabular-nums">
                {totalGuests}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                (incluindo acompanhantes)
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-[11px] uppercase tracking-wider text-neutral-600 font-medium block">
                Não Comparecerão
              </span>
              <span className="text-2xl font-serif font-bold text-neutral-800 tabular-nums">
                {declinedList.length}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#ece3d8]">
              <span className="text-[11px] uppercase tracking-wider text-[#8a7e74] font-medium block">
                Mensagens
              </span>
              <span className="text-2xl font-serif font-bold text-[#2c2725] tabular-nums">
                {rsvps.filter((r) => r.mensagem).length}
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#a89d93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, email ou telefone..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#dcd2c5] text-xs bg-[#faf8f5]/60 focus:outline-none focus:ring-1 focus:ring-[#8a6b18]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-[#e8dfd5] p-0.5 bg-[#faf8f5] text-xs">
                <button
                  type="button"
                  onClick={() => setFilterPresence('all')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    filterPresence === 'all'
                      ? 'bg-white shadow-xs font-semibold text-[#2c2725]'
                      : 'text-[#736a64]'
                  }`}
                >
                  Todos ({rsvps.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterPresence('confirmado')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    filterPresence === 'confirmado'
                      ? 'bg-white shadow-xs font-semibold text-emerald-800'
                      : 'text-[#736a64]'
                  }`}
                >
                  Confirmados
                </button>
                <button
                  type="button"
                  onClick={() => setFilterPresence('recusado')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    filterPresence === 'recusado'
                      ? 'bg-white shadow-xs font-semibold text-neutral-800'
                      : 'text-[#736a64]'
                  }`}
                >
                  Recusados
                </button>
              </div>

              <button
                type="button"
                onClick={loadData}
                disabled={isLoading}
                title="Atualizar lista"
                className="p-2 rounded-lg border border-[#e8dfd5] bg-white hover:bg-[#faf8f5] text-[#554d46] transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={exportToCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2c2725] text-white text-xs font-medium hover:bg-black transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar CSV
              </button>
            </div>
          </div>

          {/* RSVPs Table */}
          {filteredRsvps.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#ece3d8] rounded-2xl bg-[#faf8f5]/40">
              <Users className="w-10 h-10 text-[#a89d93] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#554d46]">Nenhuma confirmação encontrada</p>
              <p className="text-xs text-[#8a7e74] mt-1">
                {searchTerm
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Os convidados confirmados aparecerão aqui.'}
              </p>
            </div>
          ) : (
            <div className="border border-[#ece3d8] rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8f5] border-b border-[#ece3d8] text-[#736a64] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Convidado(a)</th>
                      <th className="py-3 px-4">Contato</th>
                      <th className="py-3 px-4">Presença</th>
                      <th className="py-3 px-4">Acompanhantes</th>
                      <th className="py-3 px-4">Restrições / Mensagem</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ece3d8]">
                    {filteredRsvps.map((entry) => (
                      <tr key={entry.id} className="hover:bg-[#faf8f5]/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-[#2c2725]">
                          {entry.nome}
                          {entry.created_at && (
                            <span className="block text-[10px] text-[#8a7e74] font-normal">
                              {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#554d46] space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-[#a89d93]" />
                            <span>{entry.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 tabular-nums">
                            <Phone className="w-3 h-3 text-[#a89d93]" />
                            <span>{entry.telefone}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {entry.presenca === 'confirmado' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Confirmado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-300">
                              <XCircle className="w-3 h-3" />
                              Não vai
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#554d46]">
                          {entry.presenca === 'confirmado' && entry.acompanhantes > 0 ? (
                            <div>
                              <span className="font-semibold text-[#2c2725] tabular-nums">
                                +{entry.acompanhantes}
                              </span>
                              {entry.nomes_acompanhantes && (
                                <span className="block text-[11px] text-[#8a7e74]">
                                  {entry.nomes_acompanhantes}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#a89d93]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#554d46] max-w-xs">
                          {entry.restricoes && (
                            <span className="inline-block text-[10px] text-amber-900 bg-amber-50 border border-amber-200/80 rounded px-1.5 py-0.5 font-medium mb-1">
                              {entry.restricoes}
                            </span>
                          )}
                          {entry.mensagem && (
                            <p className="italic text-[#2c2725] line-clamp-2">
                              &ldquo;{entry.mensagem}&rdquo;
                            </p>
                          )}
                          {!entry.mensagem && !entry.restricoes && (
                            <span className="text-[#a89d93]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id || '', entry.nome)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Remover confirmação"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#ece3d8] bg-[#faf8f5] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#dcd2c5] bg-white text-[#2c2725] text-xs font-medium hover:bg-[#f3ede3] transition-colors cursor-pointer"
          >
            Fechar Painel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
