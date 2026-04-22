# PLAN.md — Plano de Ação REURB-SLZ

> Guia de execução para desenvolvimento, onboarding de novos devs e reinicialização do projeto.

---

## Pré-requisitos

### Contas necessárias
- [ ] GitHub (fork em https://github.com/Dowingows/reurb-slz)
- [ ] [Supabase](https://supabase.com) — banco Postgres + Storage
- [ ] [Vercel](https://vercel.com) — deploy
- [ ] [Inngest](https://inngest.com) — fila de jobs (pode deixar para fases finais)

### Ferramentas locais
- [ ] Node.js 20+
- [ ] pnpm (`npm install -g pnpm`)
- [ ] Git
- [ ] GitHub CLI (`brew install gh`)

---

## Setup inicial (qualquer máquina)

```bash
# 1. Clonar o repositório
git clone https://github.com/Dowingows/reurb-slz.git
cd reurb-slz

# 2. Instalar dependências (após criar o projeto Next.js)
pnpm install

# 3. Copiar variáveis de ambiente
cp .env.example .env
# Preencher os valores no .env (ver seção abaixo)

# 4. Rodar migrations
pnpm prisma migrate dev

# 5. Popular banco com dados iniciais
pnpm prisma db seed

# 6. Iniciar servidor de desenvolvimento
pnpm dev
```

---

## Variáveis de ambiente

Crie um `.env` na raiz com os seguintes valores (obter no painel do Supabase e Inngest):

```env
# Banco de dados (Supabase Postgres)
DATABASE_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Autenticação
NEXTAUTH_SECRET=...          # gerar com: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Inngest (fila de jobs — necessário a partir da Fase 4)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
```

---

## Decisões técnicas já tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API Routes no mesmo projeto |
| Linguagem | TypeScript | Tipagem end-to-end com Prisma |
| Banco | PostgreSQL via Supabase | Gerenciado, RLS nativo |
| ORM | Prisma | Schema-first, migrations, type-safe |
| Auth | NextAuth.js v5 | Integração nativa com App Router |
| Storage | Supabase Storage | Documentos digitalizados |
| Fila | Inngest | Serverless, sem Redis |
| PWA/Offline | next-pwa + Workbox | Service Worker + IndexedDB |
| UI | Tailwind CSS + shadcn/ui | Componentes acessíveis prontos |
| Formulários | React Hook Form + Zod | Performance + validação offline |
| Excel | SheetJS (xlsx) | Importação de lotes |
| Testes | Vitest + Playwright | Unit e E2E |
| Deploy | Vercel | Zero-config com Next.js |

---

## Fases de implementação

### Fase 1 — Fundação `semanas 1–2`
> Projeto rodando, autenticação funcional com os 3 perfis, deploy inicial.

- [ ] Criar projeto Next.js 14 com TypeScript (`pnpm create next-app`)
- [ ] Configurar ESLint, Prettier, Husky + lint-staged
- [ ] Configurar Tailwind CSS + shadcn/ui (layout base, sidebar, header)
- [ ] Criar projeto no Supabase (Postgres + bucket `documentos`)
- [ ] Configurar Prisma: `prisma init` + schema User + Role
- [ ] Rodar primeira migration: `prisma migrate dev`
- [ ] Configurar NextAuth.js v5 (Credentials provider + bcrypt + role no JWT)
- [ ] Criar `middleware.ts` com proteção de rotas por role:
  - `/campo/*` → apenas CADASTRADOR
  - `/dashboard/*` → SUPERVISOR e ADMIN
  - `/admin/*` → apenas ADMIN
- [ ] Seed inicial: 1 admin, 1 supervisor, 1 cadastrador
- [ ] Deploy na Vercel + configurar variáveis de ambiente

**Entregável:** sistema no ar com login e redirecionamento por perfil.

---

### Fase 2 — Projetos e campanhas `semanas 3–4`
> Supervisor cria projeto, campanha e importa lotes do Excel.

- [ ] Migrations: ProjetoReurb, Campanha, Lote
- [ ] CRUD ProjetoReurb (listagem, criação, edição)
- [ ] CRUD Campanha (listagem por projeto, criação, transição de status)
- [ ] Importador de lotes via Excel (SheetJS)
  - Parser para o formato Morada do Sol (cada aba = uma quadra)
  - Endpoint `POST /api/campanhas/[id]/lotes/import`
  - Validação Zod + feedback de erros por linha
- [ ] Cadastro manual de lote (fallback)
- [ ] Tela de progresso da campanha (lotes vs cadastros por quadra)

**Entregável:** supervisor cria campanha completa com lotes importados.

---

### Fase 3 — PWA e cadastro offline `semanas 5–7`
> Agente faz cadastro completo offline e sincroniza ao reconectar.

- [ ] Configurar next-pwa + Workbox (cache de assets + manifest.json)
- [ ] Configurar idb (stores: campanhas, lotes, cadastros_rascunho, sync_queue, documentos_fila)
- [ ] Tela de seleção de campanha ativa (carrega do IndexedDB offline)
- [ ] Tela de seleção de lote (busca por quadra e número)
- [ ] Formulário de cadastro completo (React Hook Form + Zod):
  - Dados pessoais, cônjuge (condicional), posse, declaração de não litígio
  - Captura GPS via `navigator.geolocation`
- [ ] Upload de documentos (câmera/galeria → Blob no IndexedDB offline)
- [ ] Indicador visual de status de sync (pendente / sincronizando / sincronizado / erro)
- [ ] Background Sync API (Service Worker drena fila ao reconectar)
- [ ] Endpoint `POST /api/sync` com idempotência (`ON CONFLICT uuidLocal DO NOTHING`)
- [ ] Upload de documentos para Supabase Storage (após sync do cadastro)

**Entregável:** agente faz cadastro offline e sincroniza sem duplicações.

---

### Fase 4 — Painel do supervisor `semanas 8–9`
> Supervisor tem visibilidade e controle total sobre a campanha.

- [ ] Listagem de cadastros por campanha (filtros + paginação server-side)
- [ ] Tela de detalhe do cadastro (dados, documentos com URL assinada, histórico)
- [ ] Ações: aprovar, rejeitar (motivo obrigatório), arquivar
- [ ] Dashboard da campanha (lotes totais, pendentes, aprovados, rejeitados, produção por agente)
- [ ] Exportação CSV/Excel da campanha
- [ ] Notificação in-app de novos cadastros (polling 60s ou SSE)
- [ ] Gestão de usuários para admin (listagem, criação, ativação, troca de role)

**Entregável:** supervisor revisa, acompanha e exporta dados da campanha.

---

### Fase 5 — Qualidade e entrega `semana 10`
> Sistema estável, testado em campo e documentado.

- [ ] Testes unitários (Vitest): parser Excel, schemas Zod, sync/idempotência, permissões
- [ ] Testes E2E (Playwright): login por perfil, criar campanha, cadastro offline + sync, aprovar/rejeitar
- [ ] Auditoria de segurança: RLS Supabase, verificação de role em todos os endpoints, URLs assinadas
- [ ] Teste de campo em dispositivo real (Android + iOS em modo avião)
- [ ] Documentação: README de setup, guia do supervisor, guia do agente
- [ ] Apresentação e entrega ao cliente

**Entregável:** MVP em produção, documentado e validado em campo.

---

## Pontos em aberto

Estas decisões precisam ser validadas com o cliente antes de implementar:

| # | Questão | Impacto |
|---|---|---|
| 1 | GPS: aceitar coordenada manual como fallback se sinal fraco? | UX de campo + integridade dos dados |
| 2 | Um lote pode ter mais de um beneficiário (ex: cônjuge co-titular)? | Cardinalidade `lote ↔ beneficiario` |
| 3 | Encerramento de campanha: manual pelo supervisor ou automático por % de lotes? | Regra de negócio |
| 4 | Supervisor recebe notificação (e-mail ou push) ao chegar novo cadastro? | Módulo de notificações |
| 5 | Exportação de CRF e títulos (Word/Excel) entra no MVP ou é fase posterior? | Escopo da fase 4 |

---

## Estrutura de branches sugerida

```
main          → produção (deploy automático na Vercel)
develop       → integração das features
feat/fase-1   → fundação e autenticação
feat/fase-2   → projetos e campanhas
feat/fase-3   → PWA e cadastro offline
feat/fase-4   → painel do supervisor
feat/fase-5   → testes e entrega
```

---

*Versão: 1.0 — abril 2026*
