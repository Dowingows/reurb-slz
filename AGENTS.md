# Sistema REURB — Documento técnico

> Referência de atores, modelagem de dados e plano de implementação do sistema PWA de Regularização Fundiária Urbana.

---

## 1. Atores e perfis

### 1.1 Cadastrador (agente/técnico de campo)

Responsável pela coleta de dados diretamente no campo. Opera majoritariamente em modo offline via PWA.

**Responsabilidades:**
- Preencher o formulário de cadastro do beneficiário
- Vincular o cadastro a um lote da campanha ativa
- Capturar coordenadas GPS do imóvel
- Digitalizar e anexar documentos do beneficiário (câmera ou galeria)
- Acompanhar o status de sincronização dos registros locais

**Restrições:**
- Não pode excluir cadastros (nem os próprios)
- Não pode abrir, editar ou encerrar campanhas
- Não acessa cadastros de outros agentes na mesma campanha
- Não acessa relatórios nem painéis de gestão
- Só enxerga campanhas com status `ATIVA`

**Acesso:**
- PWA (mobile/desktop)
- Funciona offline — dados persistidos localmente via IndexedDB
- Sincronização automática ao reconectar

---

### 1.2 Supervisor (aprovador / coordenador)

Responsável pela gestão dos projetos, campanhas e aprovação dos cadastros. Opera via interface web.

**Responsabilidades:**
- Criar e gerenciar projetos REURB
- Abrir, ativar e encerrar campanhas
- Importar lotes via planilha Excel
- Revisar e aprovar/rejeitar cadastros enviados pelos agentes
- Acompanhar o progresso de cada campanha
- Gerar relatórios e exportações

**Restrições:**
- Não pode excluir cadastros permanentemente (apenas rejeitar/arquivar)
- Não acessa configurações de sistema

**Acesso:**
- Interface web (painel administrativo)
- Requer autenticação com perfil `SUPERVISOR`

---

### 1.3 Admin (devs / TI)

Perfil de administração total do sistema. Destinado à equipe técnica.

**Responsabilidades:**
- Todas as permissões do Supervisor
- Exclusão permanente de registros
- Gerenciamento de usuários e perfis
- Configurações gerais do sistema
- Acesso a logs e monitoramento

**Acesso:**
- Interface web (painel administrativo + área de configurações)
- Requer autenticação com perfil `ADMIN`

---

### 1.4 Tabela de permissões

| Ação | Cadastrador | Supervisor | Admin |
|---|:---:|:---:|:---:|
| Cadastrar beneficiário | ✅ | ✅ | ✅ |
| Editar próprio cadastro | ✅ | ✅ | ✅ |
| Editar cadastro de outro agente | ❌ | ✅ | ✅ |
| Rejeitar / arquivar cadastro | ❌ | ✅ | ✅ |
| Excluir cadastro permanentemente | ❌ | ❌ | ✅ |
| Ver cadastros de outros agentes | ❌ | ✅ | ✅ |
| Criar projeto REURB | ❌ | ✅ | ✅ |
| Abrir / encerrar campanha | ❌ | ✅ | ✅ |
| Importar lotes via Excel | ❌ | ✅ | ✅ |
| Gerar relatórios | ❌ | ✅ | ✅ |
| Exportar CRF / títulos | ❌ | ✅ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ✅ |
| Configurações do sistema | ❌ | ❌ | ✅ |
| Acesso a logs e monitoramento | ❌ | ❌ | ✅ |

---

### 1.5 Fluxo de interação entre atores

```
Admin / Supervisor
  │
  ├── Cria Projeto REURB
  ├── Cria Campanha → importa lotes (Excel)
  └── Ativa Campanha
           │
           ▼
     Cadastrador (campo — PWA offline)
           │
           ├── Seleciona campanha ativa
           ├── Seleciona lote
           ├── Preenche formulário + GPS + documentos
           └── Sincroniza ao reconectar
                      │
                      ▼
             Supervisor revisa cadastros
                      │
                      ├── Aprova → fluxo continua (pareceres / CRF)
                      └── Rejeita → cadastrador notificado para corrigir
```

---

## 2. Modelagem de dados

### 2.1 Hierarquia de entidades

```
ProjetoReurb
  └── Campanha
        └── Lote
              └── Cadastro
                    ├── Beneficiario
                    └── Documento[]
```

Um projeto REURB define o escopo jurídico e geográfico. Cada campanha é uma operação de campo vinculada a um projeto — é ela que "abre" o trabalho para os agentes. Os lotes são demarcados dentro da campanha. O cadastro é o registro central produzido em campo, vinculando beneficiário a lote.

---

### 2.2 Schema Prisma (PostgreSQL)

```prisma
// ─────────────────────────────────────────────
// AUTH / USUÁRIOS
// ─────────────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  nome      String
  email     String   @unique
  senha     String   // hash bcrypt
  role      Role     @default(CADASTRADOR)
  ativo     Boolean  @default(true)
  criadoEm  DateTime @default(now())

  cadastros          Cadastro[]
  campanhasAbertas   Campanha[] @relation("CampanhaAbertaPor")
}

enum Role {
  CADASTRADOR
  SUPERVISOR
  ADMIN
}

// ─────────────────────────────────────────────
// PROJETO REURB
// ─────────────────────────────────────────────

model ProjetoReurb {
  id           String     @id @default(cuid())
  nome         String
  municipio    String
  estado       String
  modalidade   Modalidade
  criadoEm     DateTime   @default(now())
  atualizadoEm DateTime   @updatedAt

  campanhas    Campanha[]
}

enum Modalidade {
  SOCIAL
  ESPECIFICO
}

// ─────────────────────────────────────────────
// CAMPANHA
// ─────────────────────────────────────────────

model Campanha {
  id           String         @id @default(cuid())
  projetoId    String
  projeto      ProjetoReurb   @relation(fields: [projetoId], references: [id])
  nome         String
  bairro       String
  status       StatusCampanha @default(RASCUNHO)
  abertaPorId  String
  abertaPor    User           @relation("CampanhaAbertaPor", fields: [abertaPorId], references: [id])
  abertaEm     DateTime       @default(now())
  encerradaEm  DateTime?
  atualizadoEm DateTime       @updatedAt

  lotes        Lote[]
  cadastros    Cadastro[]
}

enum StatusCampanha {
  RASCUNHO   // visível apenas para supervisor/admin
  ATIVA      // agentes conseguem ver e cadastrar
  ENCERRADA  // somente leitura
}

// ─────────────────────────────────────────────
// LOTE
// ─────────────────────────────────────────────

model Lote {
  id                   String   @id @default(cuid())
  campanhaId           String
  campanha             Campanha @relation(fields: [campanhaId], references: [id])
  numeroLote           String
  quadra               String
  areaM2               Float
  inscricaoImobiliaria String?
  confrontanteFrente   String?
  confrontanteFundo    String?
  confrontanteLd       String?
  confrontanteLe       String?
  medidaFrente         Float?
  medidaFundo          Float?
  medidaLd             Float?
  medidaLe             Float?
  // Polígono do lote como array de pontos { lat, lng }
  // Migrar para PostGIS (geometry) quando necessário
  coordenadas          Json?

  cadastros            Cadastro[]

  @@unique([campanhaId, quadra, numeroLote])
}

// ─────────────────────────────────────────────
// BENEFICIÁRIO
// ─────────────────────────────────────────────

model Beneficiario {
  id                String       @id @default(cuid())
  nome              String
  cpf               String       @unique
  rg                String?
  dataNascimento    DateTime?
  estadoCivil       EstadoCivil?
  conjugeNome       String?
  conjugeCpf        String?
  conjugeRg         String?
  nis               String?
  rendaFamiliar     Float?
  possuiOutroImovel Boolean      @default(false)
  criadoEm          DateTime     @default(now())
  atualizadoEm      DateTime     @updatedAt

  cadastros         Cadastro[]
}

enum EstadoCivil {
  SOLTEIRO
  CASADO
  UNIAO_ESTAVEL
  DIVORCIADO
  VIUVO
}

// ─────────────────────────────────────────────
// CADASTRO — entidade central produzida em campo
// ─────────────────────────────────────────────

model Cadastro {
  id                   String         @id @default(cuid())
  uuidLocal            String         @unique  // gerado no dispositivo — garante idempotência
  loteId               String
  lote                 Lote           @relation(fields: [loteId], references: [id])
  campanhaId           String
  campanha             Campanha       @relation(fields: [campanhaId], references: [id])
  beneficiarioId       String
  beneficiario         Beneficiario   @relation(fields: [beneficiarioId], references: [id])
  criadoPorId          String
  criadoPor            User           @relation(fields: [criadoPorId], references: [id])

  // Dados de posse
  tempoPosseInicio     DateTime?
  tipoAquisicao        TipoAquisicao?
  linhaSucessoria      String?        // obrigatório quando aquisição anterior a 2006
  declaracaoNaoLitigio Boolean        @default(false)

  // Coordenadas capturadas em campo via GPS do dispositivo
  // ⚠️ Em aberto: validar com cliente se fallback manual é necessário
  gpsLat               Float?
  gpsLng               Float?
  gpsAccuracy          Float?         // precisão em metros

  // Controle de fluxo
  status               StatusCadastro @default(PENDENTE)
  motivoRejeicao       String?
  revisadoPorId        String?
  revisadoEm           DateTime?

  // Controle de sync
  criadoEm             DateTime       @default(now())
  sincronizadoEm       DateTime?
  atualizadoEm         DateTime       @updatedAt

  documentos           Documento[]
}

enum StatusCadastro {
  PENDENTE    // enviado pelo agente, aguardando revisão
  APROVADO    // supervisor aprovou
  REJEITADO   // supervisor rejeitou — agente deve corrigir
  ARQUIVADO   // mantido no banco mas fora do fluxo ativo
}

enum TipoAquisicao {
  COMPRA_VENDA
  DOACAO
  HERANCA
  POSSE
  OUTROS
}

// ─────────────────────────────────────────────
// DOCUMENTO
// ─────────────────────────────────────────────

model Documento {
  id           String        @id @default(cuid())
  cadastroId   String
  cadastro     Cadastro      @relation(fields: [cadastroId], references: [id])
  tipo         TipoDocumento
  supabasePath String        // caminho no Supabase Storage
  nomeOriginal String?
  tamanhoBytes Int?
  conferido    Boolean       @default(false)
  enviadoEm    DateTime      @default(now())
}

enum TipoDocumento {
  RG
  CPF
  RG_CONJUGE
  CPF_CONJUGE
  CERTIDAO_CASAMENTO
  CERTIDAO_NASCIMENTO
  COMPROVANTE_ENDERECO
  COMPROVANTE_ENDERECO_IMOVEL
  RECIBO_COMPRA_VENDA
  DECLARACAO_POSSE
  CERTIDAO_DEBITOS_MUNICIPAIS
  NIS
  OUTROS
}
```

---

### 2.3 Fila de sincronização (IndexedDB local — não vai ao Postgres)

A `sync_queue` existe apenas no dispositivo do agente. Garante que nenhum dado seja perdido e nenhum registro seja duplicado ao sincronizar.

```typescript
// Contrato do objeto armazenado no IndexedDB

interface SyncQueueItem {
  uuidLocal: string              // ID gerado no dispositivo (uuid v4)
  tipo: 'cadastro' | 'documento'
  payload: object                // dados serializados
  status: 'pendente' | 'enviado' | 'erro'
  tentativas: number
  ultimaTentativa: string | null // ISO date string
  criadoEm: string               // ISO date string
}

// Stores do IndexedDB
// campanhas          → cache das campanhas ativas (uso offline)
// lotes              → lotes da campanha selecionada
// cadastros_rascunho → rascunhos ainda não enviados
// sync_queue         → itens aguardando sincronização
// documentos_fila    → uploads pendentes para o Supabase Storage
```

---

### 2.4 Contrato da API de sincronização

```typescript
// POST /api/sync

// Request
interface SyncRequest {
  items: Array<{
    uuidLocal: string
    tipo: 'cadastro'
    payload: CadastroPayload
  }>
}

// Response
interface SyncResponse {
  aceitos: string[]   // uuidLocal gravados com sucesso
  rejeitados: Array<{
    uuidLocal: string
    motivo: string
  }>
}

// Lógica de idempotência no backend (Prisma raw ou SQL)
// INSERT INTO "Cadastro" (...) VALUES (...)
// ON CONFLICT ("uuidLocal") DO NOTHING
// RETURNING id, "uuidLocal"
```

---

### 2.5 Índices recomendados

```sql
-- Idempotência da sync
CREATE UNIQUE INDEX idx_cadastro_uuid_local      ON "Cadastro"("uuidLocal");

-- Campanhas ativas por projeto
CREATE INDEX idx_campanha_status                 ON "Campanha"("status");
CREATE INDEX idx_campanha_projeto                ON "Campanha"("projetoId");

-- Lotes por campanha
CREATE INDEX idx_lote_campanha                   ON "Lote"("campanhaId");

-- Cadastros por lote / campanha / agente / status
CREATE INDEX idx_cadastro_lote                   ON "Cadastro"("loteId");
CREATE INDEX idx_cadastro_campanha               ON "Cadastro"("campanhaId");
CREATE INDEX idx_cadastro_criado_por             ON "Cadastro"("criadoPorId");
CREATE INDEX idx_cadastro_status                 ON "Cadastro"("status");

-- CPF único do beneficiário
CREATE UNIQUE INDEX idx_beneficiario_cpf         ON "Beneficiario"("cpf");

-- Lote único dentro da campanha
CREATE UNIQUE INDEX idx_lote_campanha_quadra_num ON "Lote"("campanhaId", "quadra", "numeroLote");
```

---

### 2.6 Diagrama de relacionamentos

```
User ──────────────────────────────────────── Cadastro (criadoPor)
 │                                                  │
 └── Campanha (abertaPor)          ┌────────────────┼────────────────┐
                                   │                │                │
ProjetoReurb ──── Campanha ──── Lote          Beneficiario      Documento[]
                      │
               StatusCampanha
               RASCUNHO → ATIVA → ENCERRADA
```

---

## 3. Stack tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API Routes no mesmo projeto |
| Linguagem | TypeScript | Tipagem end-to-end com Prisma |
| Banco de dados | PostgreSQL via Supabase | Gerenciado, RLS nativo, sem servidor próprio |
| ORM | Prisma | Schema-first, migrations, type-safe |
| Autenticação | NextAuth.js v5 | Integra nativamente com Next.js App Router |
| Storage | Supabase Storage | Documentos digitalizados de campo |
| Fila (jobs) | Inngest | Serverless, sem Redis, integra com Next.js |
| PWA / Offline | next-pwa + Workbox | Service Worker + cache de assets |
| Persistência local | idb | Wrapper tipado e leve para IndexedDB |
| Validação | Zod | Schemas compartilhados entre client e server |
| UI | Tailwind CSS + shadcn/ui | Componentes acessíveis prontos |
| Formulários | React Hook Form + Zod | Alta performance + validação offline |
| Parser Excel | SheetJS (xlsx) | Leitura da planilha de lotes (formato Morada do Sol) |
| Testes | Vitest + Playwright | Unit e E2E |
| Deploy | Vercel | Zero-config com Next.js |

---

## 4. Plano de implementação (MVP)

### Fase 1 — Fundação `semanas 1–2`

**Objetivo:** projeto rodando, autenticação funcional com os três perfis, deploy inicial.

```
[ ] Criar projeto Next.js 14 com TypeScript
[ ] Configurar ESLint, Prettier, Husky + lint-staged
[ ] Configurar Tailwind CSS + shadcn/ui (layout base, sidebar, header)
[ ] Criar projeto no Supabase (Postgres + bucket "documentos" no Storage)
[ ] prisma init + schema: User, Role
[ ] prisma migrate dev → primeira migration
[ ] Configurar NextAuth.js v5
      — Credentials provider (email + senha com bcrypt)
      — session com role no JWT
[ ] middleware.ts → proteção de rotas por role
      — /campo/*      → apenas CADASTRADOR
      — /dashboard/*  → SUPERVISOR e ADMIN
      — /admin/*      → apenas ADMIN
[ ] Seed inicial: 1 admin, 1 supervisor, 1 cadastrador
[ ] Deploy na Vercel + configurar variáveis de ambiente
```

**Entregável:** sistema no ar com login e redirecionamento por perfil funcionando.

---

### Fase 2 — Projetos e campanhas `semanas 3–4`

**Objetivo:** supervisor cria projeto, campanha e importa lotes do Excel.

```
[ ] Migrations: ProjetoReurb, Campanha, Lote
[ ] CRUD ProjetoReurb (supervisor + admin)
      — listagem, criação, edição
[ ] CRUD Campanha
      — listagem por projeto
      — criação com bairro e modalidade
      — transição de status: RASCUNHO → ATIVA → ENCERRADA
[ ] Importador de lotes via Excel
      — parser SheetJS para o formato Morada do Sol
        (cada aba = uma quadra; colunas: lote, área, confrontantes, coordenadas)
      — endpoint POST /api/campanhas/[id]/lotes/import
      — validação Zod antes de gravar
      — feedback: X lotes importados, Y erros (com detalhes por linha)
[ ] Cadastro manual de lote (fallback ao importador)
[ ] Tela de progresso da campanha
      — total de lotes vs lotes com cadastro
      — porcentagem de preenchimento por quadra
```

**Entregável:** supervisor cria campanha completa com lotes importados do Excel.

---

### Fase 3 — PWA e cadastro offline `semanas 5–7`

**Objetivo:** agente faz cadastro completo offline e sincroniza ao reconectar sem duplicações.

```
[ ] Configurar next-pwa + Workbox
      — cache de assets estáticos (JS, CSS, fontes)
      — runtime cache de campanhas ativas (stale-while-revalidate, TTL 24h)
      — manifest.json (ícone, nome, display: standalone)
[ ] Configurar idb — definir stores:
      campanhas | lotes | cadastros_rascunho | sync_queue | documentos_fila
[ ] Tela de seleção de campanha ativa no PWA
      — carrega do IndexedDB quando offline
[ ] Tela de seleção de lote (busca por quadra e número)
[ ] Formulário de cadastro (React Hook Form + Zod)
      — dados pessoais (nome, CPF, RG, nascimento, estado civil)
      — dados do cônjuge (condicional ao estado civil)
      — dados de posse (tipo, data início, linha sucessória se anterior a 2006)
      — declaração de não litígio (checkbox obrigatório)
      — captura GPS via navigator.geolocation
        ⚠️ Em aberto: validar com cliente se fallback manual é necessário
[ ] Upload de documentos
      — seleção por câmera ou galeria do dispositivo
      — preview e remoção antes de enviar
      — armazenamento local como Blob no IndexedDB enquanto offline
[ ] Indicador visual de status de sync por cadastro
      — ícone: pendente / sincronizando / sincronizado / erro
[ ] Background Sync API
      — registro do sync tag ao salvar cadastro
      — Service Worker drena a fila quando conexão retorna
[ ] Endpoint POST /api/sync
      — aceita array de cadastros com uuidLocal
      — INSERT com ON CONFLICT (uuidLocal) DO NOTHING (idempotente)
      — retorna { aceitos[], rejeitados[] }
[ ] Upload de documentos para Supabase Storage
      — após confirmação do sync do cadastro
      — fila separada (documentos_fila no IndexedDB)
      — retry automático com backoff exponencial
```

**Entregável:** agente faz cadastro completo offline (formulário + docs + GPS) e sincroniza ao reconectar.

---

### Fase 4 — Painel do supervisor `semanas 8–9`

**Objetivo:** supervisor tem visibilidade e controle total sobre a campanha.

```
[ ] Listagem de cadastros por campanha
      — filtros: status, agente, quadra, lote
      — paginação server-side
[ ] Tela de detalhe do cadastro
      — todos os dados do beneficiário e do imóvel
      — visualização dos documentos (URL assinada Supabase Storage)
      — histórico de status e revisões
[ ] Ações no cadastro
      — aprovar
      — rejeitar (campo de motivo obrigatório)
      — arquivar
[ ] Dashboard da campanha
      — total lotes | com cadastro | pendentes | aprovados | rejeitados
      — lista de lotes sem cadastro
      — produção por agente (qtd. de cadastros)
[ ] Exportação CSV/Excel da campanha
      — todos os cadastros com dados do beneficiário e do lote
[ ] Notificação in-app de novos cadastros
      — polling a cada 60s ou Server-Sent Events (SSE)
[ ] Gestão de usuários (admin)
      — listagem, criação, ativação/desativação, troca de role
```

**Entregável:** supervisor revisa, aprova, acompanha progresso e exporta dados da campanha.

---

### Fase 5 — Qualidade e entrega `semana 10`

**Objetivo:** sistema estável, testado em campo e documentado para entrega ao cliente.

```
[ ] Testes unitários (Vitest)
      — parser Excel (formato Morada do Sol)
      — schemas Zod de validação
      — lógica de sync e idempotência (ON CONFLICT)
      — funções de verificação de permissão por role
[ ] Testes E2E (Playwright)
      — login por cada perfil + redirecionamento correto
      — criar projeto → campanha → importar lotes
      — cadastro offline + reconexão + sync sem duplicação
      — aprovar e rejeitar cadastro como supervisor
[ ] Auditoria de segurança
      — RLS no Supabase (agente não acessa dados de outra campanha)
      — todos os endpoints verificam role e sessão
      — documentos no Storage com URLs assinadas (não públicas)
[ ] Teste de campo com dispositivo real
      — Android em modo avião: formulário, GPS, câmera, sync ao reconectar
      — iOS em modo avião: mesmos cenários
[ ] Documentação
      — README com setup local (clone → .env → prisma migrate → seed → dev)
      — guia rápido para o supervisor: criar campanha, importar lotes, revisar cadastros
      — guia rápido para o agente: instalar PWA, usar offline, verificar sync
[ ] Apresentação e entrega ao cliente
```

**Entregável:** MVP em produção, documentado e validado em campo.

---

## 5. Estrutura de pastas

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/                ← supervisor e admin
│   │   ├── layout.tsx
│   │   ├── page.tsx                ← dashboard home
│   │   ├── projetos/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   ├── campanhas/
│   │   │   └── [id]/
│   │   │       ├── page.tsx        ← progresso da campanha
│   │   │       ├── lotes/
│   │   │       └── cadastros/
│   │   └── admin/
│   │       └── usuarios/
│   ├── (campo)/                    ← rotas do PWA para agentes
│   │   ├── layout.tsx              ← layout mobile-first
│   │   ├── page.tsx                ← seleção de campanha
│   │   ├── [campanhaId]/
│   │   │   ├── page.tsx            ← seleção de lote
│   │   │   └── cadastro/
│   │   │       └── [loteId]/
│   │   └── sync/
│   │       └── page.tsx            ← status de sincronização
│   └── api/
│       ├── auth/
│       ├── sync/
│       │   └── route.ts            ← POST /api/sync
│       ├── campanhas/
│       │   └── [id]/
│       │       └── lotes/
│       │           └── import/
│       │               └── route.ts
│       └── uploads/
│           └── sign/
│               └── route.ts        ← URL assinada Supabase Storage
├── components/
│   ├── ui/                         ← shadcn/ui
│   ├── campo/                      ← componentes mobile do PWA
│   │   ├── FormCadastro.tsx
│   │   ├── SyncStatus.tsx
│   │   └── GpsCapture.tsx
│   └── dashboard/
│       ├── CampanhaProgress.tsx
│       └── CadastroReview.tsx
├── lib/
│   ├── prisma.ts                   ← singleton do Prisma Client
│   ├── supabase.ts                 ← cliente Supabase (server + client)
│   ├── idb.ts                      ← configuração do IndexedDB (idb)
│   ├── sync.ts                     ← lógica de drain da sync_queue
│   ├── excel-parser.ts             ← parser da planilha de lotes (SheetJS)
│   └── auth.ts                     ← configuração NextAuth.js
├── schemas/                        ← Zod schemas compartilhados client/server
│   ├── cadastro.schema.ts
│   ├── lote.schema.ts
│   └── campanha.schema.ts
└── middleware.ts                   ← proteção de rotas por role
```

---

## 6. Variáveis de ambiente

```env
# Banco de dados (Supabase Postgres)
DATABASE_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Autenticação
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://seudominio.com.br

# Inngest (fila de jobs)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
```

---

## 7. Pontos em aberto

| # | Questão | Impacto |
|---|---|---|
| 1 | GPS: aceitar coordenada manual como fallback se sinal fraco? | UX de campo + integridade dos dados |
| 2 | Um lote pode ter mais de um beneficiário (ex: cônjuge co-titular)? | Cardinalidade `lote ↔ beneficiario` |
| 3 | Critério para encerrar campanha: manual pelo supervisor ou automático por % de lotes cadastrados? | Regra de negócio |
| 4 | Supervisor recebe notificação (e-mail ou push) ao chegar novo cadastro para revisar? | Módulo de notificações |
| 5 | Exportação de CRF e títulos (Word/Excel) entra no MVP ou é fase posterior? | Escopo da fase 4 |

---

*Versão: 0.3 — reunião de planejamento técnico — abril 2026*
