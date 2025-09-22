terraform {
  backend "local" {
    path = "state/terraform.tfstate"
  }
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "1.5.1"
    }
  }
}

provider "supabase" {
  access_token = file("${path.cwd}/access-token")
}
