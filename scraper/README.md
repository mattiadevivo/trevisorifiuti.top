# TVTrash Scraper

This directory contains the **Python** scripts designed to scrape waste
collection data from the official waste management company's website. It ensures
that the TVTrash app always serves the most up-to-date calendar information.

## 🛠 Tech Stack

- **[Python](https://www.python.org/)** - Programming language.
- **[uv](https://github.com/astral-sh/uv)** - An extremely fast Python package
  installer and resolver.

## 📋 Setup

### 1. Start Local Supabase

Ensure your local Supabase instance is running (from the `supabase` directory),
as the scraper likely targets the local database by default during development.

```bash
cd ../supabase
pnpm start
```

### 2. Create Virtual Environment

```bash
uv venv
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
uv sync
```

## 🚀 Usage

Run the main scraper script:

```bash
uv run main.py
```

## ⚙️ Configuration

The scraper uses default settings defined in `scraper/config.py`. You can
override these settings using environment variables.

Example:

```bash
export DB_CONNECTION_STRING="postgresql://postgres:postgres@localhost:54322/postgres"
uv run main.py
```
