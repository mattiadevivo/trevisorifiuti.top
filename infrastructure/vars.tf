variable "supabase_publishable_key" {
  description = "Supabase publishable key"
  type        = string
}

variable "supabase_project_id" {
  description = "Supabase project id"
  type        = string
}

variable "supabase_organization_id" {
  description = "Supabase organization id"
  type        = string
}

variable "render_api_key" {
  description = "Render API key"
  type        = string
  sensitive   = true
}

variable "supabase_access_token" {
  description = "Supabase Access Token"
  type        = string
  sensitive   = true
}
