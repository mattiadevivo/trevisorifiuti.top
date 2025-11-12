## Setup

The project will store the state using [TFState.dev](https://tfstate.dev/)

- Get a `read-access` GitHub token for the repository. (For fine-grained token you just need a `Contents` permission on the repository)
- Get the render API key from [Render](https://render.com)
- Get the supabase access token from [Supabase](https://supabase.com)
- Export the token with `export TF_HTTP_PASSWORD="<github-token>"`
- Export the render API key with `export TF_VAR_render_api_key="<render-api-key>"`
- Export the supabase access token with `export TF_VAR_supabase_access_token="<supabase-access-token>"`
- Run terraform/tofu commands