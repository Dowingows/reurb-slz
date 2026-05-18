/*
  Warnings:

  - You are about to drop the column `areaM2` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `campanhaId` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `confrontanteFrente` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `confrontanteFundo` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `confrontanteLd` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `confrontanteLe` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `coordenadas` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `medidaFrente` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `medidaFundo` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `medidaLd` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `medidaLe` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `numeroLote` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `quadra` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the `Beneficiario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cadastro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Campanha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Documento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `area` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaDaEdificacao` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizadoEm` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criadoPorId` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direitoReal` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeLote` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quadraId` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoDeConstrucao` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoDeUso` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usoDoLote` to the `Lote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UsoDoLote" AS ENUM ('RESIDENCIAL', 'COMERCIAL', 'MISTO', 'INSTITUCIONAL', 'INDUSTRIAL', 'VAGO');

-- CreateEnum
CREATE TYPE "TipoDeConstrucao" AS ENUM ('ALVENARIA', 'MADEIRA', 'MISTA', 'METALICA', 'OUTROS');

-- CreateEnum
CREATE TYPE "TipoDeUso" AS ENUM ('PROPRIO', 'ALUGADO', 'CEDIDO', 'OCUPADO', 'OUTROS');

-- CreateEnum
CREATE TYPE "DireitoReal" AS ENUM ('CONCESSAO_USO', 'CONCESSAO_REAL_USO', 'LEGITIMACAO_FUNDIARIA', 'USUCAPIAO', 'OUTROS');

-- CreateEnum
CREATE TYPE "EstabilidadeEstrutura" AS ENUM ('BOA', 'REGULAR', 'RUIM', 'PESSIMA');

-- CreateEnum
CREATE TYPE "NecessidadeReconstrucao" AS ENUM ('NAO', 'PARCIAL', 'TOTAL');

-- CreateEnum
CREATE TYPE "CondicoesBanheiros" AS ENUM ('BOM', 'REGULAR', 'RUIM');

-- CreateEnum
CREATE TYPE "MaterialParedesExternas" AS ENUM ('ALVENARIA', 'MADEIRA', 'MISTO', 'TAIPA', 'METALICO', 'OUTROS');

-- CreateEnum
CREATE TYPE "CondicoesParedesExternas" AS ENUM ('BOA', 'REGULAR', 'RUIM');

-- CreateEnum
CREATE TYPE "Cobertura" AS ENUM ('LAJE', 'TELHA_CERAMICA', 'TELHA_FIBROCIMENTO', 'TELHA_METALICA', 'PALHA', 'OUTROS');

-- CreateEnum
CREATE TYPE "CondicoesInstalacoes" AS ENUM ('BOA', 'REGULAR', 'RUIM', 'AUSENTE');

-- CreateEnum
CREATE TYPE "CondicoesEsgotamento" AS ENUM ('BOA', 'REGULAR', 'RUIM', 'AUSENTE');

-- DropForeignKey
ALTER TABLE "Cadastro" DROP CONSTRAINT "Cadastro_beneficiarioId_fkey";

-- DropForeignKey
ALTER TABLE "Cadastro" DROP CONSTRAINT "Cadastro_campanhaId_fkey";

-- DropForeignKey
ALTER TABLE "Cadastro" DROP CONSTRAINT "Cadastro_criadoPorId_fkey";

-- DropForeignKey
ALTER TABLE "Cadastro" DROP CONSTRAINT "Cadastro_loteId_fkey";

-- DropForeignKey
ALTER TABLE "Campanha" DROP CONSTRAINT "Campanha_abertaPorId_fkey";

-- DropForeignKey
ALTER TABLE "Campanha" DROP CONSTRAINT "Campanha_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "Documento" DROP CONSTRAINT "Documento_cadastroId_fkey";

-- DropForeignKey
ALTER TABLE "Lote" DROP CONSTRAINT "Lote_campanhaId_fkey";

-- DropIndex
DROP INDEX "Lote_campanhaId_quadra_numeroLote_key";

-- AlterTable
ALTER TABLE "Lote" DROP COLUMN "areaM2",
DROP COLUMN "campanhaId",
DROP COLUMN "confrontanteFrente",
DROP COLUMN "confrontanteFundo",
DROP COLUMN "confrontanteLd",
DROP COLUMN "confrontanteLe",
DROP COLUMN "coordenadas",
DROP COLUMN "medidaFrente",
DROP COLUMN "medidaFundo",
DROP COLUMN "medidaLd",
DROP COLUMN "medidaLe",
DROP COLUMN "numeroLote",
DROP COLUMN "quadra",
ADD COLUMN     "area" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "areaDaEdificacao" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "criadoPorId" TEXT NOT NULL,
ADD COLUMN     "direitoReal" "DireitoReal" NOT NULL,
ADD COLUMN     "nomeLote" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "numeroSelagem" TEXT,
ADD COLUMN     "observacao" TEXT,
ADD COLUMN     "quadraId" TEXT NOT NULL,
ADD COLUMN     "rua" TEXT NOT NULL,
ADD COLUMN     "tipoDeConstrucao" "TipoDeConstrucao" NOT NULL,
ADD COLUMN     "tipoDeUso" "TipoDeUso" NOT NULL,
ADD COLUMN     "usoDoLote" "UsoDoLote" NOT NULL;

-- DropTable
DROP TABLE "Beneficiario";

-- DropTable
DROP TABLE "Cadastro";

-- DropTable
DROP TABLE "Campanha";

-- DropTable
DROP TABLE "Documento";

-- DropEnum
DROP TYPE "StatusCadastro";

-- DropEnum
DROP TYPE "StatusCampanha";

-- DropEnum
DROP TYPE "TipoAquisicao";

-- DropEnum
DROP TYPE "TipoDocumento";

-- CreateTable
CREATE TABLE "Quadra" (
    "id" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "foto" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quadra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proprietario" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeSocial" TEXT,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "nis" TEXT,
    "cnpj" TEXT,
    "email" TEXT,
    "celular" TEXT NOT NULL,
    "celular2" TEXT,
    "filiacaoMaterna" TEXT,
    "filiacaoPaterna" TEXT,
    "estadoCivil" "EstadoCivil" NOT NULL,
    "profissao" TEXT NOT NULL,
    "rendaIndividualMensal" DOUBLE PRECISION NOT NULL,
    "rendaFamiliarMensal" DOUBLE PRECISION NOT NULL,
    "recebeBolsaFamilia" BOOLEAN NOT NULL DEFAULT false,
    "recebeBPC" BOOLEAN NOT NULL DEFAULT false,
    "isPCD" BOOLEAN NOT NULL DEFAULT false,
    "temPCDNaMoradia" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proprietario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentoLote" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "rgFrente" TEXT,
    "rgVerso" TEXT,
    "cpfFoto" TEXT,
    "comprovanteResidencia" TEXT,
    "certidaoNascimentoDivorcio" TEXT,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentoLote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benfeitoria" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "estabilidadeEstrutura" "EstabilidadeEstrutura",
    "necessidadeReconstrucao" "NecessidadeReconstrucao",
    "numeroComodos" INTEGER,
    "numeroMoradoresPorComodo" INTEGER,
    "numeroBanheiros" INTEGER,
    "condicoesBanheiros" "CondicoesBanheiros",
    "materialParedesExternas" "MaterialParedesExternas",
    "condicoesParedesExternas" "CondicoesParedesExternas",
    "cobertura" "Cobertura",
    "instalacoesEletricas" TEXT[],
    "condicoesInstalacoesEletricas" "CondicoesInstalacoes",
    "instalacoesHidrossanitarias" TEXT[],
    "condicoesInstalacoesHidrossanitarias" "CondicoesInstalacoes",
    "esgotamentoSanitario" TEXT[],
    "condicoesEsgotamentoSanitario" "CondicoesEsgotamento",
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Benfeitoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proprietario_loteId_key" ON "Proprietario"("loteId");

-- CreateIndex
CREATE UNIQUE INDEX "Proprietario_cpf_key" ON "Proprietario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentoLote_loteId_key" ON "DocumentoLote"("loteId");

-- CreateIndex
CREATE UNIQUE INDEX "Benfeitoria_loteId_key" ON "Benfeitoria"("loteId");

-- AddForeignKey
ALTER TABLE "Quadra" ADD CONSTRAINT "Quadra_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "ProjetoReurb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_quadraId_fkey" FOREIGN KEY ("quadraId") REFERENCES "Quadra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proprietario" ADD CONSTRAINT "Proprietario_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoLote" ADD CONSTRAINT "DocumentoLote_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benfeitoria" ADD CONSTRAINT "Benfeitoria_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
