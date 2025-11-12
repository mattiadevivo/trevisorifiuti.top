terraform {
  backend "http" {
    address        = "https://api.tfstate.dev/github/v1"
    lock_address   = "https://api.tfstate.dev/github/v1/lock"
    unlock_address = "https://api.tfstate.dev/github/v1/lock"
    lock_method    = "PUT"
    unlock_method  = "DELETE"
    username       = "mattiadevivo/TVTrash"
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
