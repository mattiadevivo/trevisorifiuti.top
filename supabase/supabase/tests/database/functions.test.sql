begin;
select plan(4);

set local role postgres;

select has_function(
    'tvtrash',
    'get_schedules_for_date',
    ARRAY[ 'date' ],
    'Function get_schedules_for_date(date) should exist'
);
select has_function(
    'tvtrash',
    'get_schedule_for_date_and_user',
    ARRAY[ 'date', 'uuid' ],
    'Function get_schedule_for_date_and_user(date) should exist'
);

-- insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111');
-- insert into tvtrash.notification_types (id, name, info) values ('22222222-2222-2222-2222-222222222222', 'test', '{}');
-- insert into tvtrash.municipalities (id, name, zone) values ('33333333-3333-3333-3333-333333333333', 'Test Municipality', 'Test Zone');
-- insert into tvtrash.notification_preferences (user_id, notification_type_id, municipality_id) values ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333');
-- insert into tvtrash.waste_collections (id, date, waste, municipality_id) values ('44444444-4444-4444-4444-444444444444', CURRENT_DATE + INTERVAL '1 day', ARRAY['waste_test'], '33333333-3333-3333-3333-333333333333');

select function_returns('tvtrash','get_schedules_for_date', ARRAY['date'], 'setof record');
select function_returns('tvtrash','get_schedule_for_date_and_user', ARRAY['date', 'uuid'], 'setof record');

--select hasnt_rows($$select 1 from tvtrash.get_schedules_for_date((CURRENT_DATE + INTERVAL '1 day')::date)$$, 'No schedules for today');

select * from finish();
rollback;