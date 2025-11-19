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

With new `secret_key` and `publishable_key`, as stated in https://supabase.com/changelog?next=Y3Vyc29yOnYyOpK0MjAyNC0wOS0xM1QxNTowMDoyOVrOAG2JYw==&restPage=2, since they are no longer JWTs, in case we want to keep using them as authentication method in Edge functions, they are only allowed if the value in the header exactly matches the value in the `apikey` header.

Example:
```
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notification' \
  --header 'Authorization: Bearer sb_publishable_aaaaaaaaaaaaaaaaaaaa' \
  --header 'Content-Type: application/json' \
  --header 'apikey: sb_publishable_aaaaaaaaaaaaaaaaaaaa' \
  --data '{"user_id":"<user_id>"}'
```

## PostgREST

Since we are using a custom schema (tvtrash), we need to use the header `"Accept-Profile: tvtrash"` to access the API.

Example:
```sh
curl -H "Accept-Profile: tvtrash" http://localhost:54321/rest/v1/municipalities?select=*
```
