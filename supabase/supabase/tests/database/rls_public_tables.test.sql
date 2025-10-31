-- RLS tests for public read-only tables in schema tvtrash
-- Tables: municipalities, waste_collections, notification_types

begin;
select plan(15);

-- As anon: can SELECT, cannot INSERT/UPDATE/DELETE
set local role anon;
set local "request.jwt.claims" to '{}';

select lives_ok($$ select count(*) from tvtrash.municipalities $$, 'anon can select municipalities');
select lives_ok($$ select count(*) from tvtrash.waste_collections $$, 'anon can select waste_collections');
select lives_ok($$ select count(*) from tvtrash.notification_types $$, 'anon can select notification_types');

select throws_like($$ insert into tvtrash.municipalities(name, area, zone) values ('X','A','Z') $$,
                   'new row violates row-level security policy for table "municipalities"',
                   'anon cannot insert into municipalities');
select throws_like($$ update tvtrash.municipalities set name = 'Y' $$,
                   '.*(permission denied|violates row-level security).*',
                   'anon cannot update municipalities');
select throws_like($$ delete from tvtrash.municipalities $$,
                   '.*(permission denied|violates row-level security).*',
                   'anon cannot delete from municipalities');

select throws_like($$ insert into tvtrash.waste_collections(date, waste, municipality_id) values (CURRENT_DATE,ARRAY['carta'],'00000000-0000-0000-0000-000000000000') $$,
                   'new row violates row-level security policy for table "waste_collections"',
                   'anon cannot insert into waste_collections');
select throws_like($$ update tvtrash.waste_collections set waste = ARRAY['carta'] where false $$,
                   'new row violates row-level security policy for table "waste_collections"',
                   'anon cannot update waste_collections');
select throws_like($$ delete from tvtrash.waste_collections where false $$,
                   'new row violates row-level security policy for table "waste_collections"',
                   'anon cannot delete from waste_collections');

-- As authenticated: can SELECT, cannot INSERT/UPDATE/DELETE (writes via service role only)
set local role authenticated;
set local "request.jwt.claims" to '{"sub": "11111111-1111-1111-1111-111111111111"}';

select lives_ok($$ select count(*) from tvtrash.municipalities $$, 'authenticated can select municipalities');
select lives_ok($$ select count(*) from tvtrash.waste_collections $$, 'authenticated can select waste_collections');
select lives_ok($$ select count(*) from tvtrash.notification_types $$, 'authenticated can select notification_types');

select throws_like($$ insert into tvtrash.waste_collections(date, waste) values (current_date, ARRAY['paper']) $$,
                   'new row violates row-level security policy for table "waste_collections"',
                   'authenticated cannot insert into waste_collections');
select throws_like($$ update tvtrash.notification_types set name = name where false $$,
                   '.*(permission denied|violates row-level security).*',
                   'authenticated cannot update notification_types');
select throws_like($$ delete from tvtrash.notification_types where false $$,
                   '.*(permission denied|violates row-level security).*',
                   'authenticated cannot delete from notification_types');

select * from finish();
rollback;
