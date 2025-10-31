# Supabase

This project contains various stuff related to Supabase:

- sql migrations to be used both for dev and deploy purposes
- supabase functions

## Migrations

- https://supabase.com/docs/guides/deployment/managing-environments?queryGroups=environment&environment=ci#deploy-a-migration
- expose custom schema to API https://supabase.com/docs/guides/api/using-custom-schemas

## DevEnv

Install global packages
```
pnpm install
```

Run the local Supabase instance
```
pnpm start
```

## About Security

You can connect to Data API securely from your frontend application as long as:
- RLS is activated
- **Anonymous Supabase key** is used to create the Supabase client

The anon key is safe to expose with RLS enabled, because row access permission is checked against your access policies and the user's JSON Web Token (JWT). The JWT is automatically sent by the Supabase client libraries if the user is logged in using Supabase Auth.