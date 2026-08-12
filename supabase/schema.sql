-- Esegui questo script nell'SQL Editor di Supabase (Dashboard > SQL Editor > New query)

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  group_id uuid not null default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  category text not null check (category in ('adulto', 'bambino', 'senior', 'agevolata')),
  amount numeric not null,
  payment_method text not null check (payment_method in ('card', 'cash')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'cancelled')),
  stripe_session_id text
);

-- Indici utili per l'export/ricerca veloce e per raggruppare le iscrizioni multiple
create index if not exists idx_participants_status on participants(payment_status);
create index if not exists idx_participants_group on participants(group_id);

-- Abilita Row Level Security (best practice anche se accediamo solo via service key dal server)
alter table participants enable row level security;

-- Nessuna policy pubblica: solo la service_role key (usata dal backend) può leggere/scrivere.
