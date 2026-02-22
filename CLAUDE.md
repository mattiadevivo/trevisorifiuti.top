# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

trevisorifiuti.top is a monorepo webapp for Treviso, Italy residents to view waste collection calendars and receive Telegram notifications. It consists of four independent subsystems:

- **frontend/** - SolidJS web application
- **scraper/** - Python web scraper for collection data
- **supabase/** - Database schema, migrations, and edge functions
- **infrastructure/** - Terraform IaC for Supabase and Render deployment

## Development Commands

### Frontend (pnpm)
```bash
cd frontend
pnpm install
pnpm dev              # Dev server at http://localhost:3000
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm test             # Run Vitest tests
pnpm lint             # Run Biome linter
```

### Scraper (uv)
```bash
cd scraper
uv venv && source .venv/bin/activate
uv sync               # Install dependencies
uv run main.py        # Run scraper (requires local Supabase running)
pytest                # Run tests
```

### Supabase
```bash
cd supabase
pnpm install
pnpm start            # Start local Supabase instance
pnpm stop             # Stop Supabase
pnpm db:reset         # Reset database
pnpm migration:add    # Create new migration
pnpm functions:serve  # Serve edge functions locally
pnpm generate:typescript  # Generate TypeScript types from schema
pnpm db:test          # Run SQL tests (pgtap)
```

### Infrastructure (Terraform)
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

## Architecture

### Database Schema
Uses a custom PostgreSQL schema named `tvtrash` (not public). Access via REST API requires specifying the schema header:
```bash
curl -H "Accept-Profile: tvtrash" http://localhost:54321/rest/v1/municipalities
```

### Security
- Row Level Security (RLS) on all tables - anonymous Supabase key is safe to expose
- Edge functions validate JWT via `Authorization` header and `apikey` header

### Frontend Structure
- **src/app/** - Routes and application setup with global contexts (auth, supabase, theme, i18n)
- **src/features/** - Feature modules: account, auth, calendar, language, theme
- **src/components/** - Reusable UI components
- **src/supabase/** - Supabase client setup and queries

### Code Quality
- **Frontend/Supabase**: Biome (tabs, 100 line width, double quotes, always semicolons)
- **Scraper**: Ruff + mypy (single quotes, tab indents)

## Environment Variables

**Frontend** (Vite):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Scraper**:
- `DB_CONNECTION_STRING` (default: localhost Supabase at port 54322)

**Terraform**:
- `TF_HTTP_PASSWORD` (GitHub token)
- `TF_VAR_render_api_key`
- `TF_VAR_supabase_access_token`
