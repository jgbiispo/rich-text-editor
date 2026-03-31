-- ============================================================
-- Richly — Schema Supabase
-- Execute no Supabase Dashboard → SQL Editor
-- ============================================================

-- Tabela principal de notas
CREATE TABLE IF NOT EXISTS notes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL DEFAULT 'Untitled',
  content     TEXT NOT NULL DEFAULT '',
  history     JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice para buscas por usuário (performance)
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes (user_id);
CREATE INDEX IF NOT EXISTS notes_updated_at_idx ON notes (updated_at DESC);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que chama a função acima
DROP TRIGGER IF EXISTS notes_updated_at ON notes;
CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- Garante que cada usuário só acessa as próprias notas
-- ============================================================
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Remove policies anteriores se existirem
DROP POLICY IF EXISTS "users_own_notes" ON notes;

-- Política única: leitura e escrita apenas das próprias notas
CREATE POLICY "users_own_notes" ON notes
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
