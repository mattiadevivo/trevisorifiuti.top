data "github_repository" "tvtrash" {
  full_name = "mattiadevivo/trevisorifiuti.top"
}

resource "github_actions_variable" "supabase_publishable_key" {
  repository    = data.github_repository.tvtrash.name
  variable_name = "SUPABASE_PUBLISHABLE_KEY"
  value         = var.supabase_publishable_key
}

resource "github_actions_variable" "supabase_project_id" {
  repository    = data.github_repository.tvtrash.name
  variable_name = "SUPABASE_PROJECT_ID"
  value         = var.supabase_project_id
}

resource "github_actions_variable" "vapid_public_key" {
  repository    = data.github_repository.tvtrash.name
  variable_name = "VAPID_PUBLIC_KEY"
  value         = var.vapid_public_key
}
