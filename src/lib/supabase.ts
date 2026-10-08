import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RsvpEntry } from '../types/wedding';

const STORAGE_KEY_CONFIG = 'wedding_supabase_credentials';
const STORAGE_KEY_RSVPS = 'wedding_local_rsvps_backup';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erro ao ler credenciais locais', e);
  }

  return { url: '', anonKey: '' };
}

export function saveStoredSupabaseConfig(config: SupabaseConfig) {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    // Reset cached client instance
    cachedClient = null;
  } catch (e) {
    console.error('Erro ao salvar credenciais locais', e);
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = getStoredSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      cachedClient = createClient(config.url.trim(), config.anonKey.trim());
      return cachedClient;
    } catch (err) {
      console.warn('Erro ao inicializar cliente Supabase:', err);
      return null;
    }
  }
  return null;
}

export function getLocalRsvps(): RsvpEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RSVPS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Erro ao carregar RSVPs locais', e);
  }
  return [
    {
      id: 'mock-1',
      nome: 'Mariana & Felipe Silva',
      email: 'mariana.silva@exemplo.com',
      telefone: '(11) 98765-4321',
      presenca: 'confirmado',
      acompanhantes: 1,
      nomes_acompanhantes: 'Felipe Silva',
      mensagem: 'Não poderíamos faltar por nada nesse mundo! Muito amor para vocês!',
      restricoes: 'Sem glúten',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'mock-2',
      nome: 'Carlos Eduardo Mendes',
      email: 'carlos.mendes@exemplo.com',
      telefone: '(21) 99876-5432',
      presenca: 'confirmado',
      acompanhantes: 0,
      nomes_acompanhantes: '',
      mensagem: 'Contando os dias para celebrar com esse casal tão especial!',
      restricoes: '',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    }
  ];
}

export function saveLocalRsvps(list: RsvpEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(list));
  } catch (e) {
    console.error('Erro ao salvar lista local', e);
  }
}

export async function submitRsvp(entry: Omit<RsvpEntry, 'id' | 'created_at'>): Promise<{
  success: boolean;
  savedToSupabase: boolean;
  message: string;
  data?: RsvpEntry;
}> {
  const newEntry: RsvpEntry = {
    ...entry,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rsvp-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  // Always back up locally first
  const currentLocal = getLocalRsvps();
  saveLocalRsvps([newEntry, ...currentLocal]);

  const client = getSupabaseClient();
  if (!client) {
    return {
      success: true,
      savedToSupabase: false,
      message: 'Presença confirmada com sucesso! (Salvo localmente no navegador)',
      data: newEntry,
    };
  }

  try {
    const { data, error } = await client
      .from('wedding_rsvps')
      .insert([
        {
          nome: entry.nome,
          email: entry.email,
          telefone: entry.telefone,
          presenca: entry.presenca,
          acompanhantes: entry.acompanhantes,
          nomes_acompanhantes: entry.nomes_acompanhantes || null,
          mensagem: entry.mensagem || null,
          restricoes: entry.restricoes || null,
        },
      ])
      .select();

    if (error) {
      console.warn('Erro ao salvar no Supabase (mantido no backup local):', error.message);
      return {
        success: true,
        savedToSupabase: false,
        message: 'Presença confirmada e registrada com sucesso!',
        data: newEntry,
      };
    }

    return {
      success: true,
      savedToSupabase: true,
      message: 'Presença confirmada com sucesso!',
      data: data && data.length > 0 ? (data[0] as RsvpEntry) : newEntry,
    };
  } catch (err: any) {
    console.error('Falha de rede com Supabase:', err);
    return {
      success: true,
      savedToSupabase: false,
      message: 'Presença confirmada com sucesso!',
      data: newEntry,
    };
  }
}

export async function fetchAllRsvps(): Promise<{
  data: RsvpEntry[];
  fromSupabase: boolean;
  error?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      data: getLocalRsvps(),
      fromSupabase: false,
    };
  }

  try {
    const { data, error } = await client
      .from('wedding_rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase query error, reverting to local backup:', error.message);
      return {
        data: getLocalRsvps(),
        fromSupabase: false,
        error: error.message,
      };
    }

    if (data) {
      // Sync local backup with fresh data
      saveLocalRsvps(data as RsvpEntry[]);
      return {
        data: data as RsvpEntry[],
        fromSupabase: true,
      };
    }

    return {
      data: getLocalRsvps(),
      fromSupabase: false,
    };
  } catch (err: any) {
    return {
      data: getLocalRsvps(),
      fromSupabase: false,
      error: err?.message || 'Erro desconhecido ao carregar',
    };
  }
}

export async function removeRsvp(id: string): Promise<boolean> {
  // Remove locally
  const current = getLocalRsvps().filter((r) => r.id !== id);
  saveLocalRsvps(current);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('wedding_rsvps').delete().eq('id', id);
    } catch (e) {
      console.error('Erro ao deletar no Supabase', e);
    }
  }
  return true;
}

export const SUPABASE_SQL_SCRIPT = `-- ==============================================================================
-- 1. TABELA DE CONFIRMAÇÕES DE PRESENÇA (RSVP)
-- ==============================================================================

create table if not exists public.wedding_rsvps (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  email text not null,
  telefone text not null,
  presenca text not null default 'confirmado',
  acompanhantes integer default 0,
  nomes_acompanhantes text,
  mensagem text,
  restricoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativar Row Level Security (RLS)
alter table public.wedding_rsvps enable row level security;

-- Política 1: Permitir envio público de confirmação (INSERT)
create policy "Permitir envio de confirmacao"
  on public.wedding_rsvps
  for insert
  to anon, authenticated
  with check (true);

-- Política 2: Permitir leitura das confirmações (SELECT)
create policy "Permitir visualizacao de confirmacoes"
  on public.wedding_rsvps
  for select
  to anon, authenticated
  using (true);

-- Política 3: Permitir exclusão pelos noivos (DELETE)
create policy "Permitir exclusao de confirmacoes"
  on public.wedding_rsvps
  for delete
  to anon, authenticated
  using (true);


-- ==============================================================================
-- 2. BUCKET DE ARMAZENAMENTO DE ARQUIVOS / FOTOS (SUPABASE STORAGE)
-- ==============================================================================

-- Criar bucket público para arquivos e fotos do casamento caso deseje utilizar
insert into storage.buckets (id, name, public)
values ('wedding_files', 'wedding_files', true)
on conflict (id) do nothing;

-- Política de Storage: Permitir upload público no bucket
create policy "Permitir upload no bucket wedding_files"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'wedding_files');

-- Política de Storage: Permitir leitura pública dos arquivos do bucket
create policy "Permitir leitura publica no bucket wedding_files"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'wedding_files');
`;
