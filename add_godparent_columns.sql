-- Script SQL para adicionar as colunas de padrinho/madrinha na tabela Guest
-- Execute este script no seu banco de dados PostgreSQL

-- Adicionar coluna isGodparent
ALTER TABLE "Guest" 
ADD COLUMN IF NOT EXISTS "isGodparent" BOOLEAN DEFAULT false;

-- Criar enum para tipo de padrinho/madrinha
DO $$ BEGIN
    CREATE TYPE "GodparentType" AS ENUM ('PADRINHO', 'MADRINHA', 'AMBOS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Adicionar coluna godparentType
ALTER TABLE "Guest" 
ADD COLUMN IF NOT EXISTS "godparentType" "GodparentType";

-- Comentários nas colunas para documentação
COMMENT ON COLUMN "Guest"."isGodparent" IS 'Indica se o convidado é padrinho/madrinha';
COMMENT ON COLUMN "Guest"."godparentType" IS 'Tipo de padrinho/madrinha: PADRINHO, MADRINHA ou AMBOS';

