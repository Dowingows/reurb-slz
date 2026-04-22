-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CADASTRADOR', 'SUPERVISOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Modalidade" AS ENUM ('SOCIAL', 'ESPECIFICO');

-- CreateEnum
CREATE TYPE "StatusCampanha" AS ENUM ('RASCUNHO', 'ATIVA', 'ENCERRADA');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'UNIAO_ESTAVEL', 'DIVORCIADO', 'VIUVO');

-- CreateEnum
CREATE TYPE "StatusCadastro" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "TipoAquisicao" AS ENUM ('COMPRA_VENDA', 'DOACAO', 'HERANCA', 'POSSE', 'OUTROS');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('RG', 'CPF', 'RG_CONJUGE', 'CPF_CONJUGE', 'CERTIDAO_CASAMENTO', 'CERTIDAO_NASCIMENTO', 'COMPROVANTE_ENDERECO', 'COMPROVANTE_ENDERECO_IMOVEL', 'RECIBO_COMPRA_VENDA', 'DECLARACAO_POSSE', 'CERTIDAO_DEBITOS_MUNICIPAIS', 'NIS', 'OUTROS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CADASTRADOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjetoReurb" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "modalidade" "Modalidade" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjetoReurb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campanha" (
    "id" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "status" "StatusCampanha" NOT NULL DEFAULT 'RASCUNHO',
    "abertaPorId" TEXT NOT NULL,
    "abertaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encerradaEm" TIMESTAMP(3),
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lote" (
    "id" TEXT NOT NULL,
    "campanhaId" TEXT NOT NULL,
    "numeroLote" TEXT NOT NULL,
    "quadra" TEXT NOT NULL,
    "areaM2" DOUBLE PRECISION NOT NULL,
    "inscricaoImobiliaria" TEXT,
    "confrontanteFrente" TEXT,
    "confrontanteFundo" TEXT,
    "confrontanteLd" TEXT,
    "confrontanteLe" TEXT,
    "medidaFrente" DOUBLE PRECISION,
    "medidaFundo" DOUBLE PRECISION,
    "medidaLd" DOUBLE PRECISION,
    "medidaLe" DOUBLE PRECISION,
    "coordenadas" JSONB,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "estadoCivil" "EstadoCivil",
    "conjugeNome" TEXT,
    "conjugeCpf" TEXT,
    "conjugeRg" TEXT,
    "nis" TEXT,
    "rendaFamiliar" DOUBLE PRECISION,
    "possuiOutroImovel" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cadastro" (
    "id" TEXT NOT NULL,
    "uuidLocal" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "campanhaId" TEXT NOT NULL,
    "beneficiarioId" TEXT NOT NULL,
    "criadoPorId" TEXT NOT NULL,
    "tempoPosseInicio" TIMESTAMP(3),
    "tipoAquisicao" "TipoAquisicao",
    "linhaSucessoria" TEXT,
    "declaracaoNaoLitigio" BOOLEAN NOT NULL DEFAULT false,
    "gpsLat" DOUBLE PRECISION,
    "gpsLng" DOUBLE PRECISION,
    "gpsAccuracy" DOUBLE PRECISION,
    "status" "StatusCadastro" NOT NULL DEFAULT 'PENDENTE',
    "motivoRejeicao" TEXT,
    "revisadoPorId" TEXT,
    "revisadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sincronizadoEm" TIMESTAMP(3),
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cadastro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "cadastroId" TEXT NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "supabasePath" TEXT NOT NULL,
    "nomeOriginal" TEXT,
    "tamanhoBytes" INTEGER,
    "conferido" BOOLEAN NOT NULL DEFAULT false,
    "enviadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lote_campanhaId_quadra_numeroLote_key" ON "Lote"("campanhaId", "quadra", "numeroLote");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiario_cpf_key" ON "Beneficiario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cadastro_uuidLocal_key" ON "Cadastro"("uuidLocal");

-- AddForeignKey
ALTER TABLE "Campanha" ADD CONSTRAINT "Campanha_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "ProjetoReurb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campanha" ADD CONSTRAINT "Campanha_abertaPorId_fkey" FOREIGN KEY ("abertaPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cadastro" ADD CONSTRAINT "Cadastro_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cadastro" ADD CONSTRAINT "Cadastro_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cadastro" ADD CONSTRAINT "Cadastro_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "Beneficiario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cadastro" ADD CONSTRAINT "Cadastro_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "Cadastro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
