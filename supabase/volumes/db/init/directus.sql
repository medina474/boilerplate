\set pguser `echo "$POSTGRES_USER"`

create schema if not exists directus;
alter schema directus owner to pg_database_owner;

grant usage on schema directus to public;
grant usage on schema directus to anon;
grant usage on schema directus to authenticated;
grant all on schema directus to pg_database_owner;
grant usage on schema directus to postgres;
grant usage on schema directus to service_role;

create extension if not exists postgis schema directus;
