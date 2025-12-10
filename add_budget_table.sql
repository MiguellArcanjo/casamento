-- Script SQL para criar a tabela Budget
-- Execute este script no seu banco de dados PostgreSQL

CREATE TABLE IF NOT EXISTS "Budget" (
  id          TEXT PRIMARY KEY,
  category    TEXT NOT NULL,
  amount      DOUBLE PRECISION NOT NULL,
  description TEXT,
  "weddingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Budget_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"(id) ON DELETE CASCADE,
  CONSTRAINT "Budget_weddingId_category_key" UNIQUE ("weddingId", category)
);

-- Comentários nas colunas para documentação
COMMENT ON TABLE "Budget" IS 'Orçamentos por categoria para controle financeiro';
COMMENT ON COLUMN "Budget"."category" IS 'Categoria do orçamento (Buffet, Decoração, etc.)';
COMMENT ON COLUMN "Budget"."amount" IS 'Valor do orçamento';
COMMENT ON COLUMN "Budget"."description" IS 'Descrição ou observações sobre o orçamento';

