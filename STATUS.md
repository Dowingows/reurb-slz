# STATUS.md — Estado atual do projeto REURB-SLZ

> Para o parceiro de time: tudo que já foi feito, como testar e o que ainda falta.

---

## Como rodar localmente

### Pré-requisitos
- Node.js 24+ (via asdf: `asdf install nodejs 24.0.0`)
- pnpm (`npm install -g pnpm` ou via corepack)
- Conta no [Supabase](https://supabase.com) com projeto criado

### Setup
```bash
git clone https://github.com/Dowingows/reurb-slz.git
cd reurb-slz

# Instalar dependências
pnpm install

# Copiar e preencher variáveis de ambiente
cp .env.example .env
# Edite o .env com os valores do Supabase e um NEXTAUTH_SECRET gerado com:
# openssl rand -base64 32

# Aplicar migrations no banco
pnpm db:migrate

# Popular banco com usuários iniciais
pnpm db:seed

# Iniciar servidor
pnpm dev
```

Acesse: http://localhost:3000

---

## Usuários de teste (criados pelo seed)

| Email | Senha | Perfil |
|---|---|---|
| `supervisor@reurb.dev` | `senha123` | SUPERVISOR |
| `admin@reurb.dev` | `senha123` | ADMIN |
| `agente@reurb.dev` | `senha123` | CADASTRADOR |

---

## O que já funciona — testar com o supervisor

### 1. Login
- Acesse `/login`
- Entre com `supervisor@reurb.dev` / `senha123`
- Deve redirecionar para `/dashboard/projetos`

### 2. Listagem de projetos
- Acesse `/dashboard/projetos`
- Exibe tabela com nome, estado/cidade, quantidade de campanhas e documentos

### 3. Criar projeto
- Clique em **"Novo projeto"**
- Preencha: nome, estado (autocomplete com todos os estados do Brasil via IBGE), cidade (dependente do estado)
- Anexe documentos opcionais por tipo (memorial, fotos, relatórios etc.)
- Clique em **"Criar projeto"** → redireciona para a listagem

### 4. Editar projeto
- Na listagem clique em **"Ver"** em qualquer projeto
- Edite nome, estado, cidade ou remova/adicione documentos
- Clique em **"Salvar alterações"**

### 5. Upload de documentos
- Requer bucket `projetos` criado no Supabase Storage
  - Supabase → Storage → New bucket → nome: `projetos` → Create
- Os arquivos ficam em `projetos/{id_projeto}/{TIPO}_{timestamp}.ext`

---

## Variáveis de ambiente necessárias

```env
DATABASE_URL=          # Supabase → Project Settings → Database → Session mode (porta 5432)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=       # gerar: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

---

## O que ainda falta implementar

### Fase 2.5 — Campanhas e Lotes
- [ ] CRUD de Campanha vinculada a projeto (RASCUNHO → ATIVA → ENCERRADA)
- [ ] Importador de lotes via planilha Excel (formato Morada do Sol)
- [ ] Cadastro manual de lote
- [ ] Tela de progresso da campanha (lotes vs cadastros)

### Fase 3 — PWA e cadastro offline (agente de campo)
- [ ] Configurar PWA (next-pwa + Workbox) para funcionar offline
- [ ] IndexedDB para armazenar campanhas/lotes/cadastros localmente
- [ ] Formulário de cadastro do beneficiário com GPS
- [ ] Upload de documentos offline (câmera/galeria → sync posterior)
- [ ] Sincronização automática ao reconectar (sem duplicações)

### Fase 4 — Painel do supervisor
- [ ] Listagem e revisão de cadastros (aprovar / rejeitar / arquivar)
- [ ] Dashboard com progresso por campanha
- [ ] Exportação CSV/Excel dos cadastros
- [ ] Notificações de novos cadastros (polling ou SSE)
- [ ] Gestão de usuários (admin)

### Fase 5 — Qualidade e entrega
- [ ] Testes unitários (Vitest): parser Excel, schemas Zod, permissões
- [ ] Testes E2E adicionais (Playwright): fluxo offline, aprovação de cadastros
- [ ] Auditoria de segurança (RLS Supabase, URLs assinadas)
- [ ] Teste de campo em dispositivo real (Android/iOS modo avião)
- [ ] Documentação para o cliente

---

## Pontos em aberto (validar com cliente)

| # | Questão |
|---|---|
| 1 | GPS: aceitar coordenada manual como fallback se sinal fraco? |
| 2 | Um lote pode ter mais de um beneficiário (cônjuge co-titular)? |
| 3 | Encerramento de campanha: manual ou automático por % de lotes? |
| 4 | Supervisor recebe notificação (e-mail ou push) de novos cadastros? |
| 5 | Exportação de CRF e títulos entra no MVP ou é fase posterior? |

---

## Estrutura de branches

```
main       → produção
feat/fase-2.5  → campanhas e lotes (próxima)
feat/fase-3    → PWA offline
feat/fase-4    → painel supervisor
```

---

*Atualizado em: abril 2026*
