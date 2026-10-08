export interface RsvpEntry {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  presenca: 'confirmado' | 'recusado';
  acompanhantes: number;
  nomes_acompanhantes?: string;
  mensagem?: string;
  restricoes?: string;
  created_at?: string;
}

export interface WeddingConfig {
  coupleNames: string;
  weddingDate: string; // ISO date string e.g. "2026-11-21T16:30:00"
  ceremonyVenue: string;
  ceremonyAddress: string;
  ceremonyTime: string;
  receptionVenue: string;
  receptionAddress: string;
  receptionTime: string;
  dressCode: string;
  dressCodeDetails: string;
  deadlineDate: string;
  pixKey?: string;
  pixRecipient?: string;
}
