/*
  Warnings:

  - You are about to drop the column `modalidade` on the `ProjetoReurb` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoDocumentoProjeto" AS ENUM ('MEMORIAL_DESCRITIVO', 'FOTO_PROJETO', 'LEVANTAMENTO_TOPOGRAFICO', 'RELATORIO_AMBIENTAL', 'RELATORIO_URBANISTICO', 'RELATORIO_JURIDICO', 'RELATORIO_SOCIOECONOMICO');

-- AlterTable
ALTER TABLE "ProjetoReurb" DROP COLUMN "modalidade";

-- DropEnum
DROP TYPE "Modalidade";

-- CreateTable
CREATE TABLE "DocumentoProjetoReurb" (
    "id" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "tipo" "TipoDocumentoProjeto" NOT NULL,
    "supabasePath" TEXT NOT NULL,
    "nomeOriginal" TEXT,
    "tamanhoBytes" INTEGER,
    "enviadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentoProjetoReurb_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocumentoProjetoReurb" ADD CONSTRAINT "DocumentoProjetoReurb_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "ProjetoReurb"("id") ON DELETE CASCADE ON UPDATE CASCADE;
