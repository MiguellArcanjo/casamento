-- Script SQL para remover a opção 'AMBOS' do enum GodparentType
-- Execute este script no seu banco de dados PostgreSQL

-- Primeiro, atualizar registros que usam 'AMBOS' para NULL ou outro valor
UPDATE "Guest" 
SET "godparentType" = NULL 
WHERE "godparentType" = 'AMBOS';

-- Remover o valor 'AMBOS' do enum
-- Nota: PostgreSQL não permite remover valores de enum diretamente
-- Se necessário, recrie o enum sem 'AMBOS'

-- Alternativa: Se você quiser recriar o enum completamente:
-- 1. Alterar a coluna para TEXT temporariamente
-- ALTER TABLE "Guest" ALTER COLUMN "godparentType" TYPE TEXT;
-- 
-- 2. Recriar o enum sem AMBOS
-- DROP TYPE IF EXISTS "GodparentType";
-- CREATE TYPE "GodparentType" AS ENUM ('PADRINHO', 'MADRINHA');
-- 
-- 3. Alterar de volta para o enum
-- ALTER TABLE "Guest" ALTER COLUMN "godparentType" TYPE "GodparentType" USING "godparentType"::"GodparentType";

-- Versão mais segura: apenas atualizar os valores existentes
-- O Prisma vai cuidar do enum quando você rodar 'prisma db push'

