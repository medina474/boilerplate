create schema if not exists directus;
alter schema directus owner to pg_database_owner;

create extension if not exists postgis schema directus;
