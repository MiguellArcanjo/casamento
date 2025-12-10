-- Script SQL para adicionar a coluna 'family' na tabela Guest
-- Execute este script no seu banco de dados PostgreSQL

ALTER TABLE "Guest" 
ADD COLUMN IF NOT EXISTS "family" TEXT;

-- Comentário na coluna para documentação
COMMENT ON COLUMN "Guest"."family" IS 'Nome da família para agrupamento de convidados';

