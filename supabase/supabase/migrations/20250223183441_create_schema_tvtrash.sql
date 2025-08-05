CREATE SCHEMA IF NOT EXISTS tvtrash;

/*Add permissions*/
GRANT USAGE ON SCHEMA tvtrash TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA tvtrash TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA tvtrash TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA tvtrash TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA tvtrash GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA tvtrash GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA tvtrash GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS tvtrash.municipalities
(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    area VARCHAR DEFAULT NULL,
    zone VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (id),
    CONSTRAINT name_area_zone_unique UNIQUE (name, area, zone)
);

CREATE TABLE IF NOT EXISTS tvtrash.waste_collections
(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
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

CREATE TABLE IF NOT EXISTS tvtrash.notification_types
(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    info JSONB NOT NULL DEFAULT '{}',
    
    PRIMARY KEY (id),
    CONSTRAINT name_unique UNIQUE (name)
);

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

GRANT EXECUTE ON FUNCTION tvtrash.get_schedules_for_date(date) TO anon, authenticated, service_role;
/* end functions */
