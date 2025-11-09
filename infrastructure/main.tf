### Supabase
resource "supabase_project" "tvtrash" {
  organization_id   = var.supabase_organization_id
  name              = "tvtrash"
  region            = "eu-central-2"
  database_password = file("${path.cwd}/supabase-access-token")

  lifecycle {
    ignore_changes = [database_password]
  }
}

### Render
resource "render_project" "tvtrash" {
  name = "tvtrash"
  environments = {
    "dev" : {
      name : "dev",
      protected_status : "unprotected",
      network_isolated = false
    },
    "prod" : {
      name : "prod",
      protected_status : "unprotected",
      network_isolated = false
    },

  }
}
resource "render_static_site" "tvtrash_dev" {
  name          = "TVTrash-dev"
  repo_url      = "https://github.com/mattiadevivo/TVTrash"
  build_command = "pnpm build"

  branch         = "main"
  root_directory = "frontend"
  publish_path   = "dist"
  auto_deploy    = true

  environment_id = render_project.tvtrash.environments["dev"].id

  env_vars = {
    VITE_LOGIN_REDIRECT_URL = {
      value = "https://tvtrash-dev.onrender.com"
    }
    VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY = {
      value = var.supabase_publishable_key
    }
    VITE_SUPABASE_URL = {
      value = "https://${var.supabase_project_id}.supabase.co"
    }
    NODE_VERSION = {
      value = "22.19.0"
    }
  }


  #custom_domains = [
  #  { name : "static-site.example.com" },
  #]

  previews = {
    generation = "off"
  }

  notification_override = {
    notifications_to_send         = "default"
    preview_notifications_enabled = "default"
  }

  auto_deploy_trigger = "commit"

}
