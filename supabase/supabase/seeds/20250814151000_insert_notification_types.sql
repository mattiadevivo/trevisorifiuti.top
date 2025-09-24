INSERT INTO tvtrash.notification_types (name, info) VALUES (
    'telegram',
    '{}'
);
-- add test user
--INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "confirmed_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES ('00000000-0000-0000-0000-000000000000', 'ed8d5f5d-d3b9-40cc-b878-4d931c410a00', 'authenticated', 'authenticated', 'test@gmail.com', '$2a$10$KPv0P5n/0T2gNCY3Z2jiuuYj1J.690zmZCxAhck.HQoE7mSh.SD1m', '2025-08-15 13:23:20.867961+00', null, '', null, '', null, '', '', null, null, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', null, '2025-08-15 13:23:20.864459+00', '2025-08-15 13:23:20.868259+00', null, null, '', '', null, '2025-08-15 13:23:20.867961+00', '', '0', null, '', null, 'false', null, 'false');

-- add notification preference for test user via telegram
/*
INSERT INTO tvtrash.notification_preferences (user_id, notification_type_id, notification_info, municipality_id) VALUES (
    (SELECT id FROM auth.users WHERE email = 'mattiadevivo@gmail.com' LIMIT 1),
    (SELECT id FROM tvtrash.notification_types WHERE name = 'telegram'),
    '{"chat_id": "597504975"}',
    (SELECT id FROM tvtrash.municipalities WHERE name = 'Casier' LIMIT 1)
);
*/