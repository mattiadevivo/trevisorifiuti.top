terraform {
  # State is stored in Vercel Blob through a self-hosted vercel-blob-tfstate
  # gateway (https://github.com/mattiadevivo/vercel-blob-tfstate). The gateway
  # is stateless: it is run on localhost:8090 both locally (docker compose) and
  # inside CI (a GitHub Actions service container), while the actual state lives
  # in Vercel Blob. The gateway runs with no AUTH_PASSWORD (empty), but its
  # /state/* routes still require a Basic auth header - so `username` is set
  # here to make tofu send one (with an empty password). No TF_HTTP_PASSWORD
  # is needed.
  backend "http" {
    address        = "http://localhost:8090/state/tvtrash"
    lock_address   = "http://localhost:8090/state/tvtrash/lock"
    unlock_address = "http://localhost:8090/state/tvtrash/lock"
    lock_method    = "POST"
    unlock_method  = "DELETE"
    username       = "trevisorifiuti"
  }
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "1.5.1"
    }
    render = {
      source  = "render-oss/render"
      version = "1.7.5"
    }
  }
}

provider "supabase" {
  access_token = var.supabase_access_token
}

provider "render" {
  api_key  = var.render_api_key
  owner_id = "d396duje5dus73al6dq0" # or set RENDER_OWNER_ID environment variable
}
