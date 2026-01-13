<p align="center">
  <img src="public/favicon.png" alt="TVTrash Logo" width="96" height="96">
</p>

# TVTrash Frontend

This directory contains the **SolidJS** web application for **TVTrash**. It provides a fast, reactive user interface for Treviso residents to view waste collection schedules and manage notifications.

## 🛠 Tech Stack

- **[SolidJS](https://solidjs.com)** - A declarative, efficient, and flexible JavaScript library for building user interfaces.
- **[Vite](https://vitejs.dev)** - Next Generation Frontend Tooling.
- **[Tailwind CSS](https://tailwindcss.com)** - A utility-first CSS framework for rapidly building custom designs.
- **[DaisyUI](https://daisyui.com)** - The most popular, free and open-source Tailwind CSS component library.
- **[Supabase JS](https://supabase.com/docs/reference/javascript/introduction)** - Supabase client for interacting with the backend.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` (if available) or ensure you have the necessary Supabase environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally