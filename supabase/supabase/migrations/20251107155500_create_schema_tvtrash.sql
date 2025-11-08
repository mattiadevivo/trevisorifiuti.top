-- Enable extension
CREATE extension IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE extension IF NOT EXISTS pg_net WITH SCHEMA pg_net;
-- "pgtap" is a unit testing framework for PostgreSQL
create extension pgtap with schema extensions;
GRANT usage ON SCHEMA cron TO postgres;
GRANT all privileges ON all tables IN SCHEMA cron TO postgres;

CREATE SCHEMA IF NOT EXISTS tvtrash;

/* Make tvtrash schema public */
GRANT USAGE ON SCHEMA tvtrash TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA tvtrash TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA tvtrash TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA tvtrash TO anon, authenticated, service_role;
-- Give the same permissions for all the new tables that will be created in the tvtrash schema
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA tvtrash GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA tvtrash GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA tvtrash GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS tvtrash.municipalities
(
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    name VARCHAR NOT NULL,
    area VARCHAR DEFAULT NULL,
    zone VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (id),
    CONSTRAINT name_area_zone_unique UNIQUE (name, area, zone)
);
-- municipalities: public read, no writes (writes via service role only)
ALTER TABLE tvtrash.municipalities ENABLE ROW LEVEL SECURITY;
CREATE POLICY municipalities_select_public
ON tvtrash.municipalities
FOR SELECT
USING (true);

CREATE TABLE IF NOT EXISTS tvtrash.waste_collections
(
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    date DATE NOT NULL,
    waste VARCHAR[] NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    municipality_id UUID NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT date_waste_municipality_unique UNIQUE (date, waste, municipality_id),
    FOREIGN KEY (municipality_id) REFERENCES tvtrash.municipalities(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS waste_collections_date_idx ON tvtrash.waste_collections (date);
-- waste_collections: public read, no writes (writes/cleanup via service role/owner)
ALTER TABLE tvtrash.waste_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY waste_collections_select_public
ON tvtrash.waste_collections
FOR SELECT
USING (true);


CREATE TABLE IF NOT EXISTS tvtrash.notification_types
(
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    name VARCHAR NOT NULL,
    info JSONB NOT NULL DEFAULT '{}',
    
    PRIMARY KEY (id),
    CONSTRAINT name_unique UNIQUE (name)
);
-- notification_types: public read, no writes
ALTER TABLE tvtrash.notification_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY notification_types_select_public
ON tvtrash.notification_types
FOR SELECT
USING (true);

CREATE TABLE IF NOT EXISTS tvtrash.notification_preferences
(
    user_id UUID NOT NULL,
    notification_type_id UUID NOT NULL,
    notification_info JSONB NOT NULL DEFAULT '{}',
    municipality_id UUID NOT NULL,

    PRIMARY KEY (user_id, notification_type_id),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (notification_type_id) REFERENCES tvtrash.notification_types(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (municipality_id) REFERENCES tvtrash.municipalities(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Add useful indexes for joins on notification_preferences
CREATE INDEX IF NOT EXISTS notification_preferences_municipality_id_idx
  ON tvtrash.notification_preferences (municipality_id);
CREATE INDEX IF NOT EXISTS notification_preferences_notification_type_id_idx
  ON tvtrash.notification_preferences (notification_type_id);
-- notification_preferences: per-user access
ALTER TABLE tvtrash.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY notification_preferences_select_own
ON tvtrash.notification_preferences
FOR SELECT
TO authenticated
USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id); -- check that user_id is the authenticated user in INSERT/UPDATE queries

ALTER TABLE tvtrash.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY notification_preferences_insert_own
ON tvtrash.notification_preferences
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id); -- check that user_id is the authenticated user in INSERT/UPDATE queries

ALTER TABLE tvtrash.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY notification_preferences_update_own
ON tvtrash.notification_preferences
FOR UPDATE
TO authenticated
USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id); -- check that user_id is the authenticated user in INSERT/UPDATE queries

ALTER TABLE tvtrash.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY notification_preferences_delete_own
ON tvtrash.notification_preferences
FOR DELETE
TO authenticated
USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id); -- check that user_id is the authenticated user in INSERT/UPDATE queries


/* functions */
CREATE OR REPLACE FUNCTION tvtrash.get_schedules_for_date(target_date DATE)
RETURNS TABLE (
    municipality_id UUID,
    municipality_name VARCHAR,
    area VARCHAR,
    zone VARCHAR,
    collection_date DATE,
    waste VARCHAR[],
    user_id UUID,
    notification_type_name VARCHAR,
    notification_type_info JSONB,
    notification_info JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id AS municipality_id,
    m.name AS municipality_name,
    m.area,
    m.zone,
    wc.date AS collection_date,
    wc.waste,
    np.user_id,
    nt.name AS notification_type_name,
    nt.info AS notification_type_info,
    np.notification_info
  FROM tvtrash.waste_collections wc
  JOIN tvtrash.municipalities m ON wc.municipality_id = m.id
  JOIN tvtrash.notification_preferences np ON np.municipality_id = m.id
  JOIN tvtrash.notification_types nt ON nt.id = np.notification_type_id
  WHERE wc.date = target_date AND array_length(wc.waste, 1) > 0;
END;
$$;
GRANT EXECUTE ON FUNCTION tvtrash.get_schedules_for_date(date) TO service_role;

CREATE or REPLACE FUNCTION tvtrash.get_schedule_for_user(target_date DATE, target_user UUID)
RETURNS TABLE (
    municipality_id UUID,
    municipality_name VARCHAR,
    area VARCHAR,
    zone VARCHAR,
    collection_date DATE,
    waste VARCHAR[],
    user_id UUID,
    notification_type_name VARCHAR,
    notification_type_info JSONB,
    notification_info JSONB
)
LANGUAGE plpgsql  
SECURITY INVOKER SET search_path = ''
AS $$
BEGIN
  IF (select auth.role()) != 'service_role' AND target_user <> (select auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: can only request your own schedule';
  END IF;

  RETURN QUERY
  SELECT * FROM tvtrash.get_schedules_for_date(target_date) notifications
  WHERE notifications.user_id = (select auth.uid());
END;
$$ ;
GRANT EXECUTE ON FUNCTION tvtrash.get_schedule_for_user(date, uuid) TO authenticated, service_role;
/* end functions */

/* cron jobs */
--select vault.create_secret('https://project-ref.supabase.co', 'project_url');
--select vault.create_secret('YOUR_SUPABASE_ANON_KEY', 'publishable_key');
-- Send notification every day at 09:00
-- This will trigger the function to send notifications for the next day
SELECT
  cron.schedule(
    'send_collection_schedules_notification_every_day',
    '0 9 * * *', -- At 09:00 on every day-of-week.
    $$
    SELECT
      net.http_post(
          url:= (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/send-notification',
          headers:=jsonb_build_object(
            'Content-type', 'application/json',
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'secret_key')
          )
      ) AS request_id;
    $$
);

-- Cleanup old waste collections every Sunday at 09:00
SELECT
  cron.schedule(
    'cleanup_old_waste_collections',
    '0 9 * * SUN', -- At 09:00 on every Sunday 
    $$
    DELETE FROM tvtrash.waste_collections
    WHERE date < (CURRENT_DATE - INTERVAL '7 days')
    $$
);
/* end cron jobs */