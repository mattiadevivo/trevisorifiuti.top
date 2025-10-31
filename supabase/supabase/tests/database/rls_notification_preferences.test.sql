-- RLS tests for tvtrash.notification_preferences (per-user access)

begin;
select plan(6);

-- As anon: no read/write access
set local role anon;
set local "request.jwt.claims" to '{}';
select throws_like(
  $$ select count(*) from tvtrash.notification_preferences $$,
  '.*(permission denied|violates row-level security).*',
  'anon cannot select notification_preferences'
);
select throws_like(
  $$ insert into tvtrash.notification_preferences(user_id, notification_type_id, municipality_id) values ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000') $$,
  '.*(permission denied|violates row-level security).*',
  'anon cannot insert into notification_preferences'
);

-- As authenticated user A
set local role authenticated;
set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';

-- Insert as self should pass RLS and then fail due to FK constraints (proves RLS allowed)
select throws_like(
  $$ insert into tvtrash.notification_preferences(user_id, notification_type_id, municipality_id) values ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333') $$,
  '.*violates foreign key constraint.*',
  'authenticated can insert own notification_preferences (RLS passes, FK fails)'
);

-- Insert as different user should be blocked by RLS before FK
select throws_like(
  $$ insert into tvtrash.notification_preferences(user_id, notification_type_id, municipality_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333') $$,
  '.*(permission denied|violates row-level security).*',
  'authenticated cannot insert for another user'
);

-- Authenticated can SELECT own rows (table might be empty, but permission should be granted)
select lives_ok($$ select count(*) from tvtrash.notification_preferences $$, 'authenticated can select notification_preferences');

select * from finish();
rollback;
