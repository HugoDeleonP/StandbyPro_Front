# Implantação no Render

Guia da implantação prática do StandbyPro no [Render](https://render.com) —
três peças: **Postgres** (banco gerenciado), **standbypro-backend** (API
Spring Boot, Docker) e **standbypro-frontend** (este repositório, Next.js,
Docker). Cada repositório tem seu próprio `Dockerfile` e `render.yaml`.

Ordem de deploy importa: **banco → backend → frontend** (o frontend precisa
da URL pública do backend; o backend precisa da connection string do banco).

> **Plano gratuito do Render**: o Postgres free expira em 30 dias e os web
> services free "dormem" após 15 min sem tráfego (o primeiro request depois
> disso demora ~30-60s para acordar). Para a apresentação, acesse o sistema
> uns minutos antes para "acordar" os serviços.

---

## Opção A — Deploy manual pelo dashboard (mais didático)

### 1. Banco de dados

1. Dashboard do Render → **New** → **PostgreSQL**.
2. Nome: `standbypro-db`, plano **Free**. Crie.
3. Na página do banco, em **Connections**, anote `Hostname`, `Port`,
   `Database`, `Username`, `Password` (ou copie a "External Database URL").

### 2. Backend (`standbypro-backend`)

1. Dashboard → **New** → **Web Service** → conecte o repositório
   `standbypro-backend`.
2. **Runtime**: Docker (o Render detecta o `Dockerfile` na raiz automaticamente).
3. Plano **Free**. Health check path: `/api/health`.
4. Em **Environment**, adicione as variáveis:

   | Variável | Valor |
   |---|---|
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<Hostname>:<Port>/<Database>?sslmode=require` (monte a partir dos dados do passo 1 — o Render só dá o formato `postgres://`, o Spring precisa do prefixo `jdbc:`) |
   | `SPRING_DATASOURCE_USERNAME` | `<Username>` do passo 1 |
   | `SPRING_DATASOURCE_PASSWORD` | `<Password>` do passo 1 |
   | `APP_JWT_SECRET` | uma string aleatória longa (ex.: `openssl rand -base64 48`) |
   | `APP_JWT_EXPIRATION_MS` | tempo de expiração do token em ms (ex.: `3600000` = 1 hora) |
   | `STANDBYPRO_ADMIN_EMAIL` | e-mail do admin inicial (ex.: `admin@standbypro.com`) |
   | `STANDBYPRO_ADMIN_SENHA` | senha forte do admin inicial |

5. Deploy. Acompanhe os logs — a primeira subida cria as tabelas
   (`ddl-auto: update`) e semeia o usuário ADMIN (`AdminSeeder`).
6. Anote a URL pública gerada (ex.: `https://standbypro-backend.onrender.com`).
7. Teste: `curl https://standbypro-backend.onrender.com/api/health` → `{"status":"UP"}`.

### 3. Frontend (este repositório)

1. Dashboard → **New** → **Web Service** → conecte este repositório.
2. **Runtime**: Docker. Plano **Free**. Health check path: `/login`.
3. Variável de ambiente:

   | Variável | Valor |
   |---|---|
   | `BACKEND_URL` | a URL pública do backend (passo 2.6), **sem barra no final** |

4. Deploy. Acesse a URL pública do frontend e logue com o ADMIN semeado no
   passo 2.4.

---

## Opção B — Blueprint (`render.yaml`), um clique por repositório

Cada repositório já tem um `render.yaml` na raiz.

1. **Backend primeiro**: Dashboard → **New** → **Blueprint** → aponte para o
   repositório `standbypro-backend`. O Render cria o banco
   (`standbypro-db`) e o web service juntos.
2. Nas variáveis marcadas como "a preencher" (`sync: false` no blueprint:
   `SPRING_DATASOURCE_URL`, `STANDBYPRO_ADMIN_EMAIL`, `STANDBYPRO_ADMIN_SENHA`),
   preencha manualmente no dashboard antes do primeiro deploy — o
   `SPRING_DATASOURCE_URL` é montado como na Opção A, passo 4, usando os
   dados de conexão do banco que o Blueprint acabou de criar (aba
   **Connections** do `standbypro-db`). `APP_JWT_SECRET` já é gerado
   automaticamente pelo Render (`generateValue: true`).
3. **Depois o frontend**: Blueprint apontando para este repositório;
   preencha `BACKEND_URL` com a URL do backend já implantado.

---

## Checklist pós-deploy

- [ ] `GET /api/health` do backend responde `200`.
- [ ] Login no frontend com o ADMIN semeado funciona.
- [ ] Cadastrar um motor, abrir/iniciar/concluir/validar uma OS.
- [ ] Tela de Notificações mostra os eventos gerados.
- [ ] Trocar a senha do ADMIN semeado (ou criar outro ADMIN e desativar o
      seedado) antes de expor a URL publicamente por muito tempo — a senha
      inicial fica em texto plano na variável de ambiente do Render.

## Troubleshooting

- **Backend não sobe / erro de conexão com o banco**: confira se
  `SPRING_DATASOURCE_URL` tem o prefixo `jdbc:postgresql://` (não
  `postgres://`) e `?sslmode=require` no final — o Postgres do Render exige
  SSL em conexões externas.
- **Frontend sobe mas todas as páginas dão erro de conexão**: confira
  `BACKEND_URL` (sem barra final, com `https://`) e se o backend já está de
  pé (`/api/health`).
- **502/503 logo após o deploy**: normal no plano free — o serviço "acorda"
  do modo dormente, aguarde ~30-60s e tente de novo.
