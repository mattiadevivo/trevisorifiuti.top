# Create a project resource
resource "supabase_project" "tvtrash" {
  organization_id = "ahzysscgemdfcalwqnki"

  name              = "tvtrash"
  region            = "eu-central-2"
  database_password = file("${path.cwd}/access-token")

  lifecycle {
    ignore_changes = [database_password]
  }
}
