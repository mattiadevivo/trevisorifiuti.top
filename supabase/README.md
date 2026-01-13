# TVTrash Supabase

This directory manages the backend for **TVTrash** using **[Supabase](https://supabase.com)**. It includes database migrations, types, and Edge Functions.

## 🗂 Contents

- **Migrations**: SQL scripts for database schema changes and setup (located in `supabase/migrations`).
- **Edge Functions**: Serverless TypeScript functions for backend logic (e.g., sending notifications).
- **Seed Data**: Initial data for local development.

## 🚀 Local Development

To run the local Supabase instance, ensure you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed or use the project scripts.

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Supabase

```bash
pnpm start
```

## 🔐 Security & RLS

TVTrash relies on **Row Level Security (RLS)** to protect data.
- The **Anonymous Supabase key** is safe to expose on the frontend because all access is mediated by RLS policies.
- **Edge Functions** validation: Authentication in Edge Functions utilizes the `Authorization` header (Bearer JWT) and the `apikey` header.

## 📡 PostgREST & Custom Schema

The project uses a custom schema named `tvtrash`. To access tables in this schema via the REST API, you must specify the schema in the header:

```bash
curl -H "Accept-Profile: tvtrash" http://localhost:54321/rest/v1/municipalities?select=*
```
