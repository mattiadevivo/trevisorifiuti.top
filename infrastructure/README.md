# trevisorifiuti.top Infrastructure

This directory contains the **Infrastructure as Code (IaC)** configuration for
deploying the trevisorifiuti.top application using **Terraform**.

It manages the deployment of:

- **Supabase** project configuration (via `supabase` provider)
- **Render** services for the frontend and other services (via `render`
  provider)

## 🏗 Architecture

The infrastructure is defined using **Terraform / OpenTofu**. State is stored
remotely in **Vercel Blob** through a self-hosted
[`vercel-blob-tfstate`](https://github.com/mattiadevivo/vercel-blob-tfstate)
gateway that speaks the Terraform HTTP backend protocol.

The gateway is **stateless** - it only proxies reads/writes to Vercel Blob and
holds short-lived locks in Redis. It is therefore run disposably on
`localhost:8090` in two places, both pointing at the same Vercel Blob store:

- **Locally**, via `docker compose up -d` (see below), for manual runs and the
  one-off state import.
- **In CI**, as a GitHub Actions service container (see
  `.github/workflows/deploy-infrastructure.yml`).

## 📋 Prerequisites

Before running any Terraform/OpenTofu commands, ensure you have the following:

1. **Docker** (to run the local state backend).
2. **Vercel Blob token**: Create a Blob store at
   [Vercel → Storage](https://vercel.com/dashboard/stores) and copy its
   `BLOB_READ_WRITE_TOKEN`. This is where the state actually lives.
3. **Render API Key**: From your
   [Render Account Settings](https://dashboard.render.com/u/settings#api-keys).
4. **Supabase Access Token**: From your
   [Supabase Account](https://app.supabase.com/account/tokens).

Copy `example.env` to `.env` and fill in `BLOB_READ_WRITE_TOKEN`,
`TF_VAR_render_api_key` and `TF_VAR_supabase_access_token`. The backend runs
without a password (empty `AUTH_PASSWORD`), so none is needed.

## 🚀 Usage

### 0. Start the local state backend and load credentials

```bash
cp example.env .env            # fill in the three values above
docker compose up -d           # backend now on http://localhost:8090
set -a; source .env; set +a    # export TF_VAR_* into the shell for tofu
```

> `docker compose` reads `.env` on its own, but `tofu` does **not** - it only
> reads real environment variables, which is why the `source` step is required
> (otherwise tofu prompts for `var.supabase_access_token` / `var.render_api_key`).

### 1. Initialize Terraform

```bash
terraform init
```

### 2. Plan Changes

Review the changes that will be made to your infrastructure.

```bash
terraform plan
```

### 3. Apply Changes

Apply the changes to deploy/update the infrastructure.

```bash
terraform apply
```
