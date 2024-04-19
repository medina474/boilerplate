-- exporter
create user 'exporter'@'%' identified by 'myPassword' with max_user_connections 2;
grant process, replication client, slave monitor, select on *.* to 'exporter'@'%';

-- phpMyAdmin
create user 'pma'@'phpmyadmin' identified by 'motdepasse';
create database phpmyadmin;
grant all privileges on `phpmyadmin`.* to 'pma'@'phpmyadmin';
