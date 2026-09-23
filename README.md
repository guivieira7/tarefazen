# TarefaZen (TZ)

Sistema colaborativo de gestão de tarefas — API em Node.js/Express, front-end em React e persistência em PostgreSQL. Este repositório acompanha o **Plano de Gerenciamento de Configuração (PGCS)** do projeto, com enfoque em práticas DevOps (CI/CD, IaC).

## Estrutura do repositório

```
/src/api          → API Node.js (Express)
/src/web          → Front-end React (Vite)
/infra            → Infraestrutura como Código (Terraform)
/.github/workflows→ Pipelines de CI e CD (GitHub Actions)
/migrations       → Scripts de migração do banco (PostgreSQL)
/docs             → Documentação técnica e ADRs
docker-compose.yml→ Orquestração local de API + Front + Banco
```

## Como rodar localmente

Pré-requisitos: [Docker](https://www.docker.com/) e Docker Compose.

```bash
git clone https://github.com/guivieira7/tarefazen.git
cd tarefazen
docker compose up --build
```

- Front-end: http://localhost:5173
- API: http://localhost:3000 (health check em `/health`)
- Banco de dados: PostgreSQL na porta 5432 (usuário/senha `tarefazen`)

## Rodando sem Docker (desenvolvimento)

**API:**
```bash
cd src/api
npm install
npm run dev
```

**Front-end:**
```bash
cd src/web
npm install
npm run dev
```

## Testes

```bash
cd src/api
npm test
```

## CI/CD

- `.github/workflows/ci.yml`: build, lint e testes da API e do front-end a cada Pull Request; publica as imagens no GHCR quando o merge acontece na `main`.
- `.github/workflows/cd.yml`: promove o deploy para staging e, após aprovação manual, para produção.

Consulte o **PGCS** (publicado no Teams) para o detalhamento completo do processo de Gestão de Configuração e das práticas DevOps adotadas.
