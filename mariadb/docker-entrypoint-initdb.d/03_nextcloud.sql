create user 'nextcloud'@'%' identified by 'motdepasse';
grant usage on *.* to 'nextcloud'@'%' require none
  with max_queries_per_hour 0 max_connections_per_hour 0 max_updates_per_hour 0 max_user_connections 0;

create database if not exists `nextcloud`;
grant all privileges on `nextcloud`.* to 'nextcloud'@'%';
