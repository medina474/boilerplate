create role iutsd with
  login
  nosuperuser
  nocreatedb
  nocreaterole
  noinherit
  noreplication
  connection limit -1
  password 'motdepasse';

create database iutsd;
alter database iutsd owner to iutsd;
grant connect on database iutsd to iutsd;

\connect iutsd;
