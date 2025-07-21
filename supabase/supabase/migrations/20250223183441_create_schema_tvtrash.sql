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

    PRIMARY KEY (user_id, notification_type_id),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (notification_type_id) REFERENCES tvtrash.notification_types(id) ON DELETE CASCADE ON UPDATE CASCADE
);
