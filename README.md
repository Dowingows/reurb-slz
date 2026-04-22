# REURB-SLZ

Sistema PWA de Regularização Fundiária Urbana. Permite que agentes de campo cadastrem beneficiários offline e supervisores gerenciem projetos, campanhas e revisem cadastros.

## Stack

Next.js 14 · TypeScript · PostgreSQL (Supabase) · Prisma · NextAuth v5 · Tailwind CSS · shadcn/ui

## Início rápido

```bash
git clone https://github.com/Dowingows/reurb-slz.git
cd reurb-slz
pnpm install
cp .env.example .env   # preencher com credenciais do Supabase
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Acesse http://localhost:3000 e entre com `supervisor@reurb.dev` / `senha123`.

## Perfis

| Perfil | Acesso |
|---|---|
| `CADASTRADOR` | PWA mobile (`/campo`) — cadastro offline |
| `SUPERVISOR` | Dashboard web — gestão e revisão |
| `ADMIN` | Dashboard + configurações do sistema |

## Documentação

- [STATUS.md](./STATUS.md) — o que já funciona, como testar e o que falta
- [PLAN.md](./PLAN.md) — plano de implementação por fases, setup detalhado e decisões técnicas
- [AGENTS.md](./AGENTS.md) — modelagem de dados, schema Prisma e arquitetura do sistema
